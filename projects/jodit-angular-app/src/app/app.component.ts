import { Component } from '@angular/core';
import { EventObj } from 'jodit-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  content = '<h1>Hello world</h1>';

  config = {
    /*
     * Readonly: false,
     * toolbarAdaptive: false,l
     * useAceEditor: false,
     * sourceEditor: 'area'
     * buttons: [
     *     'source'
     * ]
     */
  };

  eventObj: EventObj;

  handleEvent(event: EventObj): void {
    this.eventObj = event;
  }
}
