import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    NgZone,
    OnDestroy,
    Provider,
    ViewEncapsulation
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Events, validEvents} from './Events';
import {Jodit} from 'jodit';

// declare const require: any;
// const EditorModule: any = require('jodit');


const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => JoditAngularComponent),
    multi: true
};

@Component({
    selector: 'jodit-editor',
    template: `
        <ng-template></ng-template>`,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../../../../node_modules/jodit/build/jodit.min.css'],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class JoditAngularComponent extends Events implements AfterViewInit, OnDestroy, ControlValueAccessor {

    @Input()
    set config(v: object | undefined) {
        this._config = v;
        if (this.element) {
            this.resetEditor();
        }
    }

    get config() {
        return this._config;
    }

    private _config = {};

    @Input() tagName = 'textarea';
    @Input() id: string | undefined;
    @Input() defaultValue: string | undefined;

    element: HTMLElement;
    editor: any;

    private onChangeCallback: (_: any) => {};
    private onTouchedCallback: () => {};

    constructor(private elementRef: ElementRef, private ngZone: NgZone) {
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

    resetEditor() {
        this.editor.destruct();
        this.createEditor();
    }

    ngAfterViewInit() {
        if (!this.element) {
            this.createElement();
            this.createEditor();
        }
    }

    createEditor() {
        // Create instance outside Angular scope
        this.ngZone.runOutsideAngular(() => {
            this.editor = new Jodit(this.element, this.config);
        });

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
                let eventNameInJodit = eventName.substring(2);
                eventNameInJodit = eventNameInJodit.substr(0, 1).toLowerCase() + eventNameInJodit.substring(1);
                // tslint:disable-next-line:max-line-length
                this.editor.events.on(eventNameInJodit, this.ngZone.run(() => (...args: any[]) => eventEmitter.emit({
                    args,
                    editor: this.editor
                })));
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
        if (this.editor) return;
        this.editor.setReadOnly(isDisabled);
    }
}
