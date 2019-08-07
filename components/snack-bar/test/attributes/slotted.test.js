/* eslint-disable no-unused-expressions */
import {
  html,
  fixture,
  expect,
} from '@open-wc/testing';

import '../../src/snack-bar.js';

describe('Attributes', () => {
  describe('slotted', () => {
    it('Accepts Slots', async () => {
      const foo = 1;
      const el = await fixture(html`<snack-bar><p>TEST</p></snack-bar>`);
      expect(el).dom.to.equal('<snack-bar><p>TEST</p></snack-bar>', {
        ignoreAttributes: [ 'title' ]
      });
    });
  })
});
