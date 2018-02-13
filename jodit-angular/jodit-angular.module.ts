import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoditAngularComponent } from './jodit-angular.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [JoditAngularComponent],
  exports: [
      JoditAngularComponent
  ]
})

export class JoditAngularModule { }
