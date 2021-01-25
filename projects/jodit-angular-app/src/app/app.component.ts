import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  content = '<h1>Hello world</h1>';

  config = {
    // readonly: false,
    // toolbarAdaptive: false,
    // useAceEditor: false,
    // sourceEditor: 'area'
    // buttons: [
    //     'source'
    // ]
  };

  handleEvent($event: any) {
    return false;
  }
}
