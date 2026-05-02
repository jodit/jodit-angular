import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    inject,
    Input,
    NgZone,
    OnDestroy,
    Provider,
    ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Events, EventObj, validEvents } from './Events';
import { Jodit } from 'jodit';

type JoditConfig = NonNullable<Parameters<typeof Jodit.make>[1]>;

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => JoditAngularComponent),
    multi: true
};

@Component({
    selector: 'jodit-editor',
    standalone: true,
    template: `<ng-template></ng-template>`,
    encapsulation: ViewEncapsulation.None,
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class JoditAngularComponent extends Events implements AfterViewInit, OnDestroy, ControlValueAccessor {
    private readonly elementRef = inject(ElementRef);
    private readonly ngZone = inject(NgZone);

    @Input()
    set config(v: JoditConfig | undefined) {
        this._config = v;
        if (this.element) {
            this.resetEditor();
        }
    }

    get config(): JoditConfig | undefined {
        return this._config;
    }

    private _config: JoditConfig | undefined = {};

    @Input() tagName: keyof HTMLElementTagNameMap = 'textarea';
    @Input() id: string | undefined;
    @Input() defaultValue: string | undefined;

    private element!: HTMLElement;
    private editor?: Jodit;

    private onChangeCallback?: (value: string) => void;
    private onTouchedCallback?: () => void;

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

    ngAfterViewInit(): void {
        this.createElement();
        this.createEditor();
    }

    ngOnDestroy(): void {
        this.editor?.destruct();
    }

    writeValue(v: string | null): void {
        this.value = v ?? '';
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouchedCallback = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.editor?.setReadOnly(isDisabled);
    }

    private createElement(): void {
        this.element = document.createElement(this.tagName);
        if (this.id) {
            this.element.id = this.id;
        }
        this.elementRef.nativeElement.appendChild(this.element);
    }

    private createEditor(): void {
        this.ngZone.runOutsideAngular(() => {
            this.editor = Jodit.make(this.element, this.config);
        });

        if (this.defaultValue) {
            this.editor!.value = this.defaultValue;
        }

        this.editor!.events
            .on('change', (value: string) => {
                if (this.onChangeCallback) {
                    this.ngZone.run(() => this.onChangeCallback!(value));
                }
            })
            .on('blur', () => {
                if (this.onTouchedCallback) {
                    this.ngZone.run(() => this.onTouchedCallback!());
                }
            });

        validEvents.forEach((eventName) => {
            const eventEmitter: EventEmitter<EventObj> = this[eventName];
            if (eventEmitter.observed) {
                const joditEventName = eventName.charAt(2).toLowerCase() + eventName.substring(3);
                this.editor!.events.on(
                    joditEventName,
                    (...args: unknown[]) => this.ngZone.run(() => eventEmitter.emit({ args, editor: this.editor }))
                );
            }
        });
    }

    private resetEditor(): void {
        this.editor?.destruct();
        this.createEditor();
    }
}
