import { Jodit } from 'jodit';

export interface EventObj {
  args: KeyboardEvent[];
  editor: Jodit;
}
