import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JoditAngularModule } from 'jodit-angular';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
    let component: AppComponent,
    fixture: ComponentFixture<AppComponent>;

    beforeEach(async() => {
        await TestBed.configureTestingModule({
            imports: [
                JoditAngularModule,
                FormsModule
            ],
            declarations: [
                AppComponent
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(async() => {
        fixture = TestBed.createComponent(AppComponent),
        component = fixture.debugElement.componentInstance;
    });


    it('should create the app component', () => {
        expect(component).toBeTruthy();
    });

    it('should be display the Jodit html editor', () => {
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('.jodit-container')).toBeTruthy();
    });
});
