## API

Two classes were exported; `Toggle` and `ToggleMenu`.

`Toggle` is a general-purpose toggle utility while `ToggleMenu` extends `Toggle` and used mainly for a menu, particularly for a menu with fragment identifiers.
```
Toggle(toggleEl, config);
Toggle(rootEl, config);
```

## Usage
### Toggle
```
new Toggle('.toggle-button', {
    target: '.toggle-target'
});
```
Or use the static method to initialize all instance of toggle on the page:
```
Toggle.init();
```
The HTML should have the following attributes:
```
<button data-o-component="o-toggle">Toggle</button>
```
You can also add `data-o-toggle-target=".toggle-target"` on it. If `config` is not specified, it will fallback to this attribute to find the toggle target.

### ToggleMenu
```
new ToggleMenu('.menu', {
    target: toggleTargetEl,
    autoCollapse: true,
    autoCollapseAnchor: 'menu-link'    
});
```

