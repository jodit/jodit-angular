import {
    Component,
    Input,
    Provider,
    forwardRef,
    OnDestroy,
    AfterViewInit,
    ViewEncapsulation,
    ElementRef,
    EventEmitter,
    NgZone
} from '@angular/core';

import Jodit from "jodit";

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {Events, validEvents} from "./Events";

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => JoditAngularComponent),
    multi: true
};

@Component({
    selector: 'jodit-editor',
    template: `<ng-template></ng-template>`,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../node_modules/jodit/build/jodit.min.css'],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class JoditAngularComponent extends Events implements AfterViewInit, OnDestroy, ControlValueAccessor {
    private elementRef: ElementRef;

    @Input() config: object | undefined = {};
    @Input() tagName: string = 'textarea';
    @Input() id: string | undefined;
    @Input() defaultValue: string | undefined;


    ngZone: NgZone;

    element: HTMLElement;
    editor: Jodit;

    constructor(elementRef: ElementRef, ngZone: NgZone) {
        super();
        this.elementRef = elementRef;
        this.ngZone = ngZone;
    }

    createElement() {
        const tagName = typeof this.tagName === 'string' ? this.tagName : 'textarea';
        this.element = document.createElement(tagName);
        if (this.element) {
            this.element.id = this.id;
            this.elementRef.nativeElement.appendChild(this.element);
        }
    }

    private onChangeCallback: (_: any) => {};
    private onTouchedCallback: () => {};

    get value(): string {
        if (this.editor) {
            return this.editor.getEditorValue();
        } else {
            return '';
        }
    }

    set value(v: string) {
        if (this.editor) {
            this.editor.setEditorValue(v || '');
        } else {
            this.defaultValue = v;
        }
    }

    ngAfterViewInit() {
        if (!this.element) {
            this.createElement();
        }

        this.editor = new Jodit(this.element, this.config);

        if (this.defaultValue) {
            this.editor.value = this.defaultValue;
        }

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


        validEvents.forEach((eventName) => {
            const eventEmitter: EventEmitter<any> = this[eventName];
            if (eventEmitter.observers.length > 0) {
                this.editor.events.on(eventName.substring(2), this.ngZone.run(() => (value: any, ...args) => eventEmitter.emit({ value, args, editor: this.editor})));
            }
        });
    }

    ngOnDestroy() {
        if (this.editor) {
            this.editor.destruct();
        }
    }

    writeValue(v: any): void {
        this.value = v;
    }

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }
    registerOnTouched(fn: () => {}): void {
        this.onTouchedCallback = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.editor.setReadOnly(isDisabled);
    }
}
