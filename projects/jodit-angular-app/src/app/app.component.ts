import {Component} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'app';

    config = {
        readonly: true,
        toolbarAdaptive: false,
        buttons: [
            'source'
        ]
    };

    handleEvent($event: any) {
        return false;
    }
}
