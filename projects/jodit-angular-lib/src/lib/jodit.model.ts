import { Jodit } from 'jodit';
import { Config } from 'jodit/esm/config';

export interface EventObj {
  args: KeyboardEvent[];
  editor: Jodit;
}

export interface EditorConfig extends Config {
}