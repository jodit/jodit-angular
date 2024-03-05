import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JoditAngularComponent } from './jodit-angular.component';

describe('JoditAngularComponent', () => {
  let component: JoditAngularComponent;
  let fixture: ComponentFixture<JoditAngularComponent>;

  beforeEach(waitForAsync(() => {
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
