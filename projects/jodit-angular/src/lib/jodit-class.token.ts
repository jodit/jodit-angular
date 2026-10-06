import { InjectionToken } from '@angular/core';
import type { Jodit } from 'jodit';

export type JoditClass = typeof Jodit;

// Lets an app substitute its own Jodit build (custom bundle, Jodit PRO) for the default one.
export const JODIT_CLASS = new InjectionToken<JoditClass>('JODIT_CLASS');
