import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Provider,
  ViewEncapsulation,
  forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Events, validEvents } from './Events';
import { Jodit } from 'jodit';
import { Config } from 'jodit/esm/config';
import { EventObj } from './jodit.model';


const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => JoditAngularComponent),
  multi: true
};

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'jodit-editor',
  styleUrls: ['../../../../node_modules/jodit/es2021/jodit.min.css'],
  template: '<ng-template></ng-template>',
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class JoditAngularComponent extends Events implements AfterViewInit, OnDestroy, ControlValueAccessor {

  @Input()
  set config(v: Config) {
    this._config = v;
    this.element && this.resetEditor();
  }

  get config(): Config {
    return this._config;
  }

  private _config: Config = {} as Config;

  @Input() tagName = 'textarea';
  @Input() id: string | undefined;
  @Input() defaultValue: string | undefined;

  element: HTMLElement;
  editor: Jodit;

  private onChangeCallback: (_: string) => void;
  private onTouchedCallback: () => void;

  constructor(private elementRef: ElementRef, private ngZone: NgZone) {
    super();
    this.elementRef = elementRef;
    this.ngZone = ngZone;
  }

  createElement(): void {
    const tagName = typeof this.tagName === 'string' ? this.tagName : 'textarea';
    this.element = document.createElement(tagName);
    if (this.element) {
      this.element.id = this.id;
      this.elementRef.nativeElement.appendChild(this.element);
    }
  }


  get value(): string {
    return this.editor ? this.editor.getEditorValue() : '';
  }

  set value(v: string) {
    if (this.editor) {
      this.editor.setEditorValue(v || '');
    } else {
      this.defaultValue = v;
    }
  }

  resetEditor(): void {
    this.editor.destruct();
    this.createEditor();
  }

  ngAfterViewInit(): void {
    if (!this.element) {
      this.createElement();
      this.createEditor();
    }
  }

  createEditor(): void {
    // Create instance outside Angular scope
    this.ngZone.runOutsideAngular(() => {
      this.editor = Jodit.make(this.element, this.config);
    });
    this.defaultValue && (this.editor.value = this.defaultValue);
    this.editor.events
      .on('change', (value: string) => {
        if (typeof this.onChangeCallback === 'function') {
          this.ngZone.run(() => this.onChangeCallback(value));
        }
      })
      .on('blur', () => {
        if (typeof this.onTouchedCallback === 'function') {
          this.ngZone.run(() => this.onTouchedCallback());
        }
      });
      this.validateEvent();
  }

  validateEvent(): void {
    validEvents.forEach((eventName) => {
      const eventEmitter: EventEmitter<EventObj> = this[eventName];
      if (eventEmitter.observers.length > 0) {
        let eventNameInJodit = eventName.substring(2);
        eventNameInJodit = eventNameInJodit.substr(0, 1).toLowerCase() + eventNameInJodit.substring(1);
        this.editor.events.on(eventNameInJodit, this.ngZone.run(() => (...args: KeyboardEvent[]) => eventEmitter.emit({
          args,
          editor: this.editor
        })));
      }
    });
  }

  ngOnDestroy(): void {
    this.editor?.destruct();
  }

  writeValue(v: string): void {
    this.value = v;
  }

  registerOnChange(fn: () => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.editor?.setReadOnly(isDisabled);
  }
}
