import { NgModule } from '@angular/core';
import { JoditAngularComponent } from './jodit-angular.component';

// Kept for NgModule-based apps; standalone apps can import JoditAngularComponent directly.
@NgModule({
  imports: [JoditAngularComponent],
  exports: [JoditAngularComponent],
})
export class JoditAngularModule {}
