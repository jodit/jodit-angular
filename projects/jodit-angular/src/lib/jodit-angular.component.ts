import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  ViewEncapsulation,
  forwardRef,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { Jodit } from 'jodit';
import { JODIT_CLASS, JoditClass } from './jodit-class.token';
import { JODIT_EVENTS, JoditEvent, JoditEventOutput } from './events';

export type JoditConfig = NonNullable<Parameters<JoditClass['make']>[1]>;

let defaultJoditClass: Promise<JoditClass> | undefined;

// Jodit touches `window` at import time, so it is loaded lazily and only in the browser.
function loadDefaultJodit(): Promise<JoditClass> {
  defaultJoditClass ??= import('jodit').then((m) => m.Jodit);
  return defaultJoditClass;
}

@Component({
  selector: 'jodit-editor',
  standalone: true,
  template: '',
  encapsulation: ViewEncapsulation.None,
  styleUrl: '../../../../node_modules/jodit/es2021/jodit.min.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JoditAngularComponent),
      multi: true,
    },
  ],
})
export class JoditAngularComponent
  implements AfterViewInit, OnChanges, OnDestroy, ControlValueAccessor
{
  @Input() config: JoditConfig = {};
  @Input() tagName = 'textarea';
  @Input() id: string | undefined;
  @Input() defaultValue: string | undefined;

  @Output() onReady = new EventEmitter<Jodit>();
  @Output() onChange = new EventEmitter<JoditEvent>();
  @Output() onBeforeEnter = new EventEmitter<JoditEvent>();
  @Output() onKeydown = new EventEmitter<JoditEvent>();
  @Output() onMousedown = new EventEmitter<JoditEvent>();
  @Output() onClick = new EventEmitter<JoditEvent>();
  @Output() onFocus = new EventEmitter<JoditEvent>();
  @Output() onBlur = new EventEmitter<JoditEvent>();
  @Output() onPaste = new EventEmitter<JoditEvent>();
  @Output() onResize = new EventEmitter<JoditEvent>();
  @Output() onBeforeCommand = new EventEmitter<JoditEvent>();
  @Output() onAfterCommand = new EventEmitter<JoditEvent>();
  @Output() onAfterExec = new EventEmitter<JoditEvent>();
  @Output() onAfterPaste = new EventEmitter<JoditEvent>();
  @Output() onChangeSelection = new EventEmitter<JoditEvent>();

  editor: Jodit | null = null;
  element: HTMLElement | null = null;

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly ngZone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly customJoditClass = inject(JODIT_CLASS, { optional: true });

  private onChangeCallback: ((value: string) => void) | null = null;
  private onTouchedCallback: (() => void) | null = null;

  private pendingValue: string | undefined;
  private pendingDisabled: boolean | undefined;
  private isWritingValue = false;
  private createToken = 0;
  private destroyed = false;

  get value(): string {
    return this.editor ? this.editor.value : (this.pendingValue ?? this.defaultValue ?? '');
  }

  set value(v: string | null | undefined) {
    const html = v ?? '';
    if (this.editor) {
      this.isWritingValue = true;
      try {
        this.editor.value = html;
      } finally {
        this.isWritingValue = false;
      }
    } else {
      this.pendingValue = html;
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser || this.element) {
      return;
    }
    this.createElement();
    void this.createEditor();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && !changes['config'].firstChange && this.element) {
      this.resetEditor();
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.createToken++;
    this.destroyEditor();
    this.element?.remove();
    this.element = null;
  }

  resetEditor(): void {
    if (this.editor) {
      this.pendingValue = this.editor.value;
      this.pendingDisabled = this.editor.getReadOnly();
    }
    this.destroyEditor();
    void this.createEditor();
  }

  writeValue(v: string | null | undefined): void {
    this.value = v;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.editor) {
      this.editor.setReadOnly(isDisabled);
    } else {
      this.pendingDisabled = isDisabled;
    }
  }

  private createElement(): void {
    const tagName = typeof this.tagName === 'string' && this.tagName ? this.tagName : 'textarea';
    this.element = document.createElement(tagName);
    if (this.id) {
      this.element.id = this.id;
    }
    this.elementRef.nativeElement.appendChild(this.element);
  }

  private async createEditor(): Promise<void> {
    const token = ++this.createToken;
    const JoditClass = this.customJoditClass ?? (await loadDefaultJodit());

    if (token !== this.createToken || this.destroyed || !this.element) {
      return;
    }

    const editor = this.ngZone.runOutsideAngular(() =>
      JoditClass.make(this.element as HTMLElement, this.config),
    );
    this.editor = editor;

    const initial = this.pendingValue ?? this.defaultValue;
    if (initial !== undefined) {
      this.value = initial;
    }
    this.pendingValue = undefined;

    if (this.pendingDisabled !== undefined) {
      editor.setReadOnly(this.pendingDisabled);
      this.pendingDisabled = undefined;
    }

    editor.e
      .on('change', (value: string) => {
        if (!this.isWritingValue && this.onChangeCallback) {
          this.ngZone.run(() => this.onChangeCallback?.(value));
        }
      })
      .on('blur', () => {
        if (this.onTouchedCallback) {
          this.ngZone.run(() => this.onTouchedCallback?.());
        }
      });

    (Object.keys(JODIT_EVENTS) as JoditEventOutput[]).forEach((outputName) => {
      const emitter = this[outputName];
      if (!emitter.observed) {
        return;
      }
      editor.e.on(JODIT_EVENTS[outputName], (...args: unknown[]) => {
        this.ngZone.run(() => emitter.emit({ args, editor }));
      });
    });

    if (this.onReady.observed) {
      this.ngZone.run(() => this.onReady.emit(editor));
    }
  }

  private destroyEditor(): void {
    const editor = this.editor;
    this.editor = null;
    if (editor && !editor.isInDestruct) {
      this.ngZone.runOutsideAngular(() => editor.destruct());
    }
  }
}
