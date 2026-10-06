import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import type { Jodit } from 'jodit';
import { JoditAngularComponent, JoditConfig, JoditEvent } from 'jodit-angular';

@Component({
  selector: 'app-root',
  imports: [JoditAngularComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  content = '<h1>Hello world</h1><p>Edit me</p>';
  readonly config = signal<JoditConfig>({
    height: 300,
    toolbarAdaptive: false,
  });
  readonly disabled = signal(false);
  readonly lastEvent = signal('');
  readonly control = new FormControl<string>('<p>Reactive forms work too</p>');

  editor: Jodit | null = null;

  onReady(editor: Jodit): void {
    this.editor = editor;
  }

  onChange(event: JoditEvent): void {
    this.lastEvent.set(`change: ${String(event.args[0]).length} chars`);
  }

  toggleToolbar(): void {
    this.config.update((c) => ({ ...c, toolbar: c.toolbar === false ? true : false }));
  }
}
