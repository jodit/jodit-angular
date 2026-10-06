# Jodit Angular Component

[![npm](https://img.shields.io/npm/v/jodit-angular.svg)](https://www.npmjs.com/package/jodit-angular)
[![npm](https://img.shields.io/npm/dm/jodit-angular.svg)](https://www.npmjs.com/package/jodit-angular)
[![npm](https://img.shields.io/npm/l/jodit-angular.svg)](https://www.npmjs.com/package/jodit-angular)
[![CI](https://github.com/jodit/jodit-angular/actions/workflows/release.yml/badge.svg)](https://github.com/jodit/jodit-angular/actions/workflows/release.yml)

Angular wrapper for the [Jodit](https://xdsoft.net/jodit/) WYSIWYG editor.

| jodit-angular | Angular    | Jodit |
| ------------- | ---------- | ----- |
| 2.x           | 20, 21, 22 | 4.x   |
| 1.14.x        | 14         | 3.x   |
| 1.9 – 1.13    | 9 – 13     | 3.x   |

## Installation

```bash
npm install jodit-angular jodit
```

## Usage

### Standalone component

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JoditAngularComponent } from 'jodit-angular';

@Component({
  selector: 'app-root',
  imports: [JoditAngularComponent, FormsModule],
  template: `<jodit-editor [(ngModel)]="content" [config]="config" />`,
})
export class App {
  content = '<p>Hello world</p>';
  config = { height: 300 };
}
```

### NgModule

```typescript
import { JoditAngularModule } from 'jodit-angular';

@NgModule({
  imports: [BrowserModule, FormsModule, JoditAngularModule],
})
export class AppModule {}
```

### Reactive forms

```html
<jodit-editor [formControl]="control" />
```

`disabled` state of the control toggles Jodit read-only mode, including when it is set before the
editor is created.

## Inputs

| Input          | Type          | Default      | Description                                                                                                                |
| -------------- | ------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `config`       | `JoditConfig` | `{}`         | Any [Jodit option](https://xdsoft.net/jodit/docs/classes/config.Config.html). Changing the reference recreates the editor. |
| `tagName`      | `string`      | `'textarea'` | Element Jodit is attached to.                                                                                              |
| `id`           | `string`      |              | `id` attribute of that element.                                                                                            |
| `defaultValue` | `string`      |              | Initial HTML when no form binding is used.                                                                                 |

Jodit picks a toolbar layout by editor width, so to override buttons for every size set
`buttons`, `buttonsMD`, `buttonsSM` and `buttonsXS` together.

## Outputs

```html
<jodit-editor (onReady)="editor = $event" (onChange)="handle($event)" />
```

`onReady` emits the `Jodit` instance once it is created. Every other output emits
`{ args, editor }`, where `args` are the arguments Jodit passed to the event:

`onChange`, `onBeforeEnter`, `onKeydown`, `onMousedown`, `onClick`, `onFocus`, `onBlur`, `onPaste`,
`onResize`, `onBeforeCommand`, `onAfterCommand`, `onAfterExec`, `onAfterPaste`, `onChangeSelection`.

Handlers are only attached to Jodit for outputs you actually bind, so unused events cost nothing.

## Accessing the editor instance

```typescript
@ViewChild(JoditAngularComponent) joditComponent!: JoditAngularComponent;

ngAfterViewInit() {
  // may still be null right after view init, prefer (onReady)
  this.joditComponent.editor?.s.insertHTML('<b>hi</b>');
}
```

## Styles

The component bundles `jodit/es2021/jodit.min.css` with `ViewEncapsulation.None`, so no extra
setup is required. To use another theme or build, add it to `styles` in `angular.json`.

## Custom Jodit build or Jodit PRO

Jodit is imported lazily from the `jodit` package. To use your own bundle, Jodit PRO or a
pre-configured `Jodit` class, provide it through `JODIT_CLASS`:

```typescript
import { JODIT_CLASS } from 'jodit-angular';
import { Jodit } from 'jodit-pro';

bootstrapApplication(App, {
  providers: [{ provide: JODIT_CLASS, useValue: Jodit }],
});
```

## Server-side rendering

Nothing from Jodit is evaluated on the server. The editor is created in the browser after the
first render, so Angular Universal and prerendering work out of the box.

## Development

```bash
npm ci
npm start          # demo app with the library linked from dist/
npm test           # karma + ChromeHeadless
npm run build      # builds dist/jodit-angular
```

Library sources live in `projects/jodit-angular`, the demo in `projects/demo`.

## Release

Releases are built and published by GitHub Actions when a version tag is pushed. The `main`
branch is protected, so the bump is done locally by a maintainer:

```bash
npm version patch   # bumps both package.json files, updates CHANGELOG, commits and tags
git push --follow-tags origin main
```

The `release.yml` workflow runs tests, publishes `dist/jodit-angular` to npm through OIDC
trusted publishing and creates a GitHub release from `CHANGELOG.md`.

## License

MIT
