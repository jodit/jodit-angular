import { NgModule } from '@angular/core';
import { JoditAngularComponent } from './jodit-angular.component';

// NgModule wrapper kept for backward compatibility.
// Standalone Angular 14+ apps can also import JoditAngularComponent directly.
@NgModule({
    imports: [JoditAngularComponent],
    exports: [JoditAngularComponent]
})
export class JoditAngularModule {}
