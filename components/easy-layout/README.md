# \<calendar-helper>

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation
```bash
npm install @web-helpers/easy-layout
```
or
```bash
yarn add @web-helpers/easy-layout
```

## Usage
```html
<script type="module">
  import '@web-helpers/register-calendar-helper.js';
</script>

<calendar-helper></calendar-helper>
```
or
```js
import { register } from '@web-helpers/easy-layout';

register('tag-name')

html`<tag-name></tag-name>`
```
or
```js
import { register, Template } from '@web-helpers/easy-layout';

class MyComponent extends Template {
  /* ... */
}

register('tag-name', MyComponent)

html`<tag-name></tag-name>`
```

## Testing using karma (if applied by author)
```bash
yarn test
```

## Testing using karma via browserstack (if applied by author)
```bash
yarn test:bs
```

## Demoing using storybook (if applied by author)
```bash
yarn storybook
```

## Linting (if applied by author)
```bash
yarn lint
```
