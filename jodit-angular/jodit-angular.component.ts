import {
    Component,
    Input,
    Provider,
    forwardRef,
    OnDestroy,
    AfterViewInit,
    ViewEncapsulation, ElementRef, NgZone
} from '@angular/core';

import Jodit from "jodit";

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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

export class JoditAngularComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
    private elementRef: ElementRef;

    @Input() config: object | undefined = {};
    @Input() tagName: string = 'textarea';
    @Input() id: string | undefined;

    ngZone: NgZone;

    element: HTMLElement;
    editor;

    constructor(elementRef: ElementRef, ngZone: NgZone) {
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
        }
    }

    ngAfterViewInit() {
        if (!this.element) {
            this.createElement();
        }

        this.editor = new Jodit(this.element, this.config);
        this.editor.events
            .on('change', this.onChange)
            .on('blur', this.onTouched);
    }

    ngOnDestroy() {
        if (this.editor) {
            this.editor.destruct();
        }
    }


    onChange = (value: string) => {
        if (typeof this.onChangeCallback === 'function') {
            this.ngZone.run(() => this.onChangeCallback(value));
        }
    };

    onTouched = () => {
        if (typeof this.onTouchedCallback === 'function') {
            this.ngZone.run(() => this.onTouchedCallback());
        }
    };

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
