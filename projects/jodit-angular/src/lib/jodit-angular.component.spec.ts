import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JoditAngularComponent } from './jodit-angular.component';
import { JoditEvent } from './events';
import { JODIT_CLASS } from './jodit-class.token';

const waitForEditor = async (
  fixture: ComponentFixture<unknown>,
  component: JoditAngularComponent,
): Promise<void> => {
  fixture.detectChanges();
  for (let i = 0; i < 100 && !component.editor; i++) {
    await new Promise((r) => setTimeout(r, 10));
  }
  if (!component.editor) {
    throw new Error('Editor was not created');
  }
  await component.editor.waitForReady();
  fixture.detectChanges();
};

@Component({
  standalone: true,
  imports: [JoditAngularComponent, FormsModule],
  template: `
    @if (visible()) {
      <jodit-editor
        [(ngModel)]="content"
        [config]="config()"
        [defaultValue]="defaultValue"
        [id]="'my-editor'"
        (onReady)="readyCount = readyCount + 1"
        (onChange)="changes.push($event)"
      />
    }
  `,
})
class HostComponent {
  content = '<p>initial</p>';
  defaultValue: string | undefined;
  readonly config = signal<Record<string, unknown>>({ showXPathInStatusbar: false });
  readonly visible = signal(true);
  readyCount = 0;
  changes: JoditEvent[] = [];
}

@Component({
  standalone: true,
  imports: [JoditAngularComponent, ReactiveFormsModule],
  template: `<jodit-editor [formControl]="control" />`,
})
class ReactiveHostComponent {
  readonly control = new FormControl<string>({ value: '<p>reactive</p>', disabled: true });
}

describe('JoditAngularComponent with real Jodit', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let component: JoditAngularComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    component = fixture.debugElement.children[0].componentInstance as JoditAngularComponent;
    await waitForEditor(fixture, component);
  });

  afterEach(() => fixture.destroy());

  it('creates the editor on the generated element', () => {
    expect(component.editor).toBeTruthy();
    expect(component.element?.tagName).toBe('TEXTAREA');
    expect(component.element?.id).toBe('my-editor');
    expect(fixture.nativeElement.querySelector('.jodit-container')).toBeTruthy();
    expect(component.editor?.o.showXPathInStatusbar).toBeFalse();
  });

  it('writes the ngModel value into the editor', () => {
    expect(component.value).toBe('<p>initial</p>');
    expect(component.editor?.value).toBe('<p>initial</p>');
  });

  it('emits onReady once', () => {
    expect(host.readyCount).toBe(1);
  });

  it('propagates editor changes to the model and the onChange output', () => {
    component.editor!.value = '<p>typed</p>';
    fixture.detectChanges();
    expect(host.content).toBe('<p>typed</p>');
    expect(host.changes.length).toBe(1);
    expect(host.changes[0].args[0]).toBe('<p>typed</p>');
    expect(host.changes[0].editor).toBe(component.editor!);
  });

  it('does not report programmatic writes back to the form', () => {
    const spy = jasmine.createSpy('onChange');
    component.registerOnChange(spy);
    component.writeValue('<p>from form</p>');
    expect(component.editor?.value).toBe('<p>from form</p>');
    expect(spy).not.toHaveBeenCalled();
  });

  it('recreates the editor when config changes and keeps the value', async () => {
    const first = component.editor!;
    first.value = '<p>kept</p>';
    host.config.set({ showXPathInStatusbar: false, toolbar: false });
    fixture.detectChanges();
    await waitForEditor(fixture, component);
    expect(component.editor).not.toBe(first);
    expect(first.isDestructed).toBeTrue();
    expect(component.editor?.o.toolbar).toBeFalse();
    expect(component.editor?.value).toBe('<p>kept</p>');
  });

  it('destroys the editor when removed from the DOM', async () => {
    const editor = component.editor!;
    host.visible.set(false);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(editor.isDestructed).toBeTrue();
    expect(fixture.nativeElement.querySelector('.jodit-container')).toBeNull();
  });
});

describe('JoditAngularComponent with reactive forms', () => {
  it('applies the disabled state set before the editor exists', async () => {
    await TestBed.configureTestingModule({ imports: [ReactiveHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ReactiveHostComponent);
    fixture.detectChanges();
    const component = fixture.debugElement.children[0].componentInstance as JoditAngularComponent;
    await waitForEditor(fixture, component);

    expect(component.editor?.getReadOnly()).toBeTrue();
    expect(component.editor?.value).toBe('<p>reactive</p>');

    fixture.componentInstance.control.enable();
    expect(component.editor?.getReadOnly()).toBeFalse();
    fixture.destroy();
  });
});

describe('JoditAngularComponent with a custom JODIT_CLASS', () => {
  class FakeJodit {
    static instances: FakeJodit[] = [];
    static make(element: HTMLElement, options: unknown): FakeJodit {
      const instance = new FakeJodit(element, options);
      FakeJodit.instances.push(instance);
      return instance;
    }
    value = '';
    readOnly = false;
    isInDestruct = false;
    isDestructed = false;
    handlers: Record<string, (...args: unknown[]) => void> = {};
    e: { on: (name: string, cb: (...args: unknown[]) => void) => FakeJodit['e'] } = {
      on: (name, cb) => {
        this.handlers[name] = cb;
        return this.e;
      },
    };
    constructor(
      public element: HTMLElement,
      public options: unknown,
    ) {}
    setReadOnly(v: boolean): void {
      this.readOnly = v;
    }
    getReadOnly(): boolean {
      return this.readOnly;
    }
    destruct(): void {
      this.isInDestruct = true;
      this.isDestructed = true;
    }
    waitForReady(): Promise<this> {
      return Promise.resolve(this);
    }
  }

  beforeEach(() => {
    FakeJodit.instances = [];
  });

  it('uses the provided class instead of the bundled Jodit', async () => {
    await TestBed.configureTestingModule({
      imports: [JoditAngularComponent],
      providers: [{ provide: JODIT_CLASS, useValue: FakeJodit }],
    }).compileComponents();

    const fixture = TestBed.createComponent(JoditAngularComponent);
    fixture.componentRef.setInput('config', { foo: 1 });
    fixture.componentRef.setInput('tagName', 'div');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(FakeJodit.instances.length).toBe(1);
    const fake = FakeJodit.instances[0];
    expect(fake.element.tagName).toBe('DIV');
    expect(fake.options).toEqual({ foo: 1 });

    fixture.componentInstance.setDisabledState(true);
    expect(fake.readOnly).toBeTrue();

    fixture.destroy();
    expect(fake.isDestructed).toBeTrue();
  });
});
