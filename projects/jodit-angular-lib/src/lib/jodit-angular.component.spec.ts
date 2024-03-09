import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JoditAngularComponent } from './jodit-angular.component';

describe('JoditAngularComponent', () => {
  let component: JoditAngularComponent,
    fixture: ComponentFixture<JoditAngularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JoditAngularComponent],
    }).compileComponents();
  });

  it('should create the lib component', () => {
    fixture = TestBed.createComponent(JoditAngularComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
