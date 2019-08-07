import { storiesOf, html, withKnobs, withClassPropertiesKnobs } from '@open-wc/demoing-storybook';

import { TestDemo } from '../src/TestDemo.js';
import '../scroll-listener.js';

storiesOf('scroll-listener', module)
  .addDecorator(withKnobs)
  .add('Documentation', () => withClassPropertiesKnobs(TestDemo))
  .add(
    'Alternative Title',
    () => html`
      <scroll-listener .title=${'Something else'}></scroll-listener>
    `,
  );
