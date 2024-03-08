import { Component } from '@angular/core';
import { EventObj, EditorConfig } from 'jodit-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'app';
  content: string = '<h1>Hello world</h1>';
  config: EditorConfig = {
    /*
     * Readonly: false,
     * toolbarAdaptive: false,l
     * useAceEditor: false,
     * sourceEditor: 'area'
     * buttons: [
     *     'source'
     * ]
     */
  } as EditorConfig;
  eventObj: EventObj;

  handleEvent(event: EventObj): void {
    this.eventObj = event;
  }
}
