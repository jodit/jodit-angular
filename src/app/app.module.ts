import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { JoditAngularModule } from "../../jodit-angular/jodit-angular.module";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
      BrowserModule,
      JoditAngularModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
