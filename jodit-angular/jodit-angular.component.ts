import {
    Component,
    Input,
    Provider,
    forwardRef,
    OnDestroy,
    AfterViewInit,
    ViewEncapsulation, ElementRef
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

    element: HTMLElement;
    editor;

    createElement() {
        const tagName = typeof this.tagName === 'string' ? this.tagName : 'textarea';
        this.element = document.createElement(tagName);
        if (this.element) {
            this.element.id = this.id;
            this.elementRef.nativeElement.appendChild(this.element);
        }
    }

    private onTouchedCallback: () => {};
    private onChangeCallback: (_: any) => {};

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
    }

    ngOnDestroy() {
        if (this.editor) {
            this.editor.destruct();
        }
    }

    onBlur() {
        if (typeof this.onTouchedCallback === 'function') {
            this.onTouchedCallback();
        }
    }

    onChange(event: any) {
        if (typeof this.onChangeCallback === 'function') {
            this.onChangeCallback(event.target.value);
        }
    }

    writeValue(v: any): void {
        this.value = v;
    }

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn;
    }
}
