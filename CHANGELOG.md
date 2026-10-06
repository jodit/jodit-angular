# Changelog

## 2.0.0 (2026-10-06)

Complete rewrite for modern Angular and Jodit 4.

### Breaking

- Requires Angular 20, 21 or 22 and Jodit `^4.0.0`.
- `JoditAngularComponent` is standalone. `JoditAngularModule` is still exported for NgModule apps.
- `jodit` is a peer dependency: install it next to `jodit-angular`.
- `rxjs`, `core-js`, `zone.js` and the other Angular packages are no longer peer dependencies (#113).
- Jodit is loaded lazily with a dynamic `import()`; the editor appears one microtask after the view is rendered. Use `(onReady)` to get the instance.

### Added

- `(onReady)` output emitting the `Jodit` instance (#104).
- `JODIT_CLASS` injection token to plug a custom Jodit bundle or Jodit PRO (#129, #110).
- Works with Angular Universal / SSR: nothing touches `window` on the server (#100).
- `setDisabledState` before the editor exists is remembered and applied on init (#112, #31).
- Value written through forms before the editor is ready is applied on init.
- Config changes recreate the editor but keep its value and read-only state (#23).
- ESM-only build, no more CommonJS bailout warnings (#84).

### Fixed

- Editor is destroyed when the component is removed from the DOM (#15, #133).
- Programmatic `writeValue` no longer marks the form control dirty.
- Event outputs now run inside the Angular zone.
- Jodit event handlers are only attached for outputs that have subscribers.

## 1.14.2 and earlier

See git history of the `v8`...`v14` branches.
