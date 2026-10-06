import type { Jodit } from 'jodit';

export interface JoditEvent {
  args: unknown[];
  editor: Jodit;
}

// Output name -> Jodit event name
export const JODIT_EVENTS = {
  onChange: 'change',
  onBeforeEnter: 'beforeEnter',
  onKeydown: 'keydown',
  onMousedown: 'mousedown',
  onClick: 'click',
  onFocus: 'focus',
  onBlur: 'blur',
  onPaste: 'paste',
  onResize: 'resize',
  onBeforeCommand: 'beforeCommand',
  onAfterCommand: 'afterCommand',
  onAfterExec: 'afterExec',
  onAfterPaste: 'afterPaste',
  onChangeSelection: 'changeSelection',
} as const;

export type JoditEventOutput = keyof typeof JODIT_EVENTS;
