import {
    Component,
    Input,
    Provider,
    forwardRef,
    OnDestroy,
    AfterViewInit,
    ViewEncapsulation
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
    template: `<textarea id="{{elementId}}" (change)="onChange($event)" (blur)="onBlur()"></textarea>`,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../node_modules/jodit/build/jodit.min.css'],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})

export class JoditAngularComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
    @Input() elementId: String;
    editor;

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
        this.editor = new Jodit('#' + this.elementId, {});
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
