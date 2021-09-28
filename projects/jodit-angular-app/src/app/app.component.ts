import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  sampletext = 'Sample Text';

  config = {
    readonly: false,
    toolbarAdaptive: true
  };

  handleEvent($event: any) {
    console.log('onBeforeEnter', $event);
    return false;
  }
}
