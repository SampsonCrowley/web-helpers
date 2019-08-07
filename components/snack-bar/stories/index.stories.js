import { storiesOf, html, withKnobs, withClassPropertiesKnobs } from '@open-wc/demoing-storybook';

import { TestDemo } from '../src/TestDemo.js';
import '../snack-bar.js';

storiesOf('snack-bar', module)
  .addDecorator(withKnobs)
  .add('Documentation', () => withClassPropertiesKnobs(TestDemo))
  .add(
    'Alternative Title',
    () => html`
      <snack-bar .title=${'Something else'}></snack-bar>
    `,
  );
