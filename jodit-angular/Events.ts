import { Output, EventEmitter } from '@angular/core';
import Jodit from "jodit";

export interface EventObj<T> {
    value: T;
    args: any[];
    editor: Jodit;
}

export class Events {
    @Output() onChange: EventEmitter<EventObj<string>> = new EventEmitter();
}


export const validEvents: (keyof Events)[] = [
    'onChange',
];