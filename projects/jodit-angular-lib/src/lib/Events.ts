import { Output, EventEmitter, Directive } from '@angular/core';

export interface EventObj {
  args: any[];
  editor: any;
}

@Directive()
// tslint:disable-next-line:directive-class-suffix
export class Events {
  // tslint:disable:no-output-on-prefix
  @Output() onChange: EventEmitter<EventObj> = new EventEmitter();
  @Output() onBeforeEnter: EventEmitter<EventObj> = new EventEmitter(false);
  @Output() onKeydown: EventEmitter<EventObj> = new EventEmitter(false);
  @Output() onMousedown: EventEmitter<EventObj> = new EventEmitter(false);
  @Output() onClick: EventEmitter<EventObj> = new EventEmitter(false);
  @Output() onFocus: EventEmitter<EventObj> = new EventEmitter();
  @Output() onBlur: EventEmitter<EventObj> = new EventEmitter();
  @Output() onPaste: EventEmitter<EventObj> = new EventEmitter(false);
  @Output() onResize: EventEmitter<EventObj> = new EventEmitter();
  @Output() onBeforeCommand: EventEmitter<EventObj> = new EventEmitter(false);
  @Output() onAfterCommand: EventEmitter<EventObj> = new EventEmitter();
  @Output() onAfterExec: EventEmitter<EventObj> = new EventEmitter();
  @Output() onAfterPaste: EventEmitter<EventObj> = new EventEmitter();
  @Output() onChangeSelection: EventEmitter<EventObj> = new EventEmitter();
}


export const validEvents: (keyof Events)[] = [
  'onChange',
  'onBeforeEnter',
  'onKeydown',
  'onMousedown',
  'onClick',
  'onFocus',
  'onBlur',
  'onPaste',
  'onResize',
  'onBeforeCommand',
  'onAfterCommand',
  'onAfterExec',
  'onAfterPaste',
  'onChangeSelection',
];
