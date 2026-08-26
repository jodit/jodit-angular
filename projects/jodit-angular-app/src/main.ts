import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

import 'jodit/esm/plugins/all';

bootstrapApplication(AppComponent).catch(err => console.error(err));
