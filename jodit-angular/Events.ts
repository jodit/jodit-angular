import { Output, EventEmitter } from '@angular/core';
import Jodit from "jodit";

export interface EventObj<T> {
    value: T;
    args: any[];
    editor: Jodit;
}

export class Events {
    @Output() onChange: EventEmitter<EventObj<string>> = new EventEmitter();
    @Output() onBeforeEnter: EventEmitter<EventObj<string>> = new EventEmitter();
    @Output() onKeydown: EventEmitter<EventObj<string>> = new EventEmitter();
    @Output() onMousedown: EventEmitter<EventObj<string>> = new EventEmitter();
    @Output() onClick: EventEmitter<EventObj<string>> = new EventEmitter();
    @Output() onFocus: EventEmitter<EventObj<string>> = new EventEmitter();
    @Output() onPaste: EventEmitter<EventObj<string>> = new EventEmitter();
    @Output() onResize: EventEmitter<EventObj<string>> = new EventEmitter();
    @Output() onBeforeCommand: EventEmitter<EventObj<string>> = new EventEmitter();
    @Output() onAfterCommand: EventEmitter<EventObj<string>> = new EventEmitter();
    @Output() onAfterExec: EventEmitter<EventObj<string>> = new EventEmitter();
    @Output() onAfterPaste: EventEmitter<EventObj<string>> = new EventEmitter();
    @Output() onChangeSelection: EventEmitter<EventObj<string>> = new EventEmitter();
}


export const validEvents: (keyof Events)[] = [
    'onChange',
    'onBeforeEnter',
    'onKeydown',
    'onMousedown',
    'onClick',
    'onFocus',
    'onPaste',
    'onResize',
    'onBeforeCommand',
    'onAfterCommand',
    'onAfterExec',
    'onAfterPaste',
    'onChangeSelection',
];