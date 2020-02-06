import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoditAngularComponent } from './jodit-angular.component';

describe('JoditAngularComponent', () => {
  let component: JoditAngularComponent;
  let fixture: ComponentFixture<JoditAngularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoditAngularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoditAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
