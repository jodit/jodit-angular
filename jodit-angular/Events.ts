import { Output, EventEmitter } from '@angular/core';

export interface EventObj<T> {
    event: T;
    editor: any;
}

export class Events {
    @Output() onChange: EventEmitter<EventObj<ClipboardEvent>> = new EventEmitter();
}