import { storiesOf, html, withKnobs, withClassPropertiesKnobs } from '@open-wc/demoing-storybook';

import { TestDemo } from '../src/TestDemo.js';
import '../test-demo.js';

storiesOf('test-demo', module)
  .addDecorator(withKnobs)
  .add('Documentation', () => withClassPropertiesKnobs(TestDemo))
  .add(
    'Alternative Title',
    () => html`
      <test-demo .title=${'Something else'}></test-demo>
    `,
  );
