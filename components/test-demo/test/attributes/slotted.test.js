/* eslint-disable no-unused-expressions */
import {
  html,
  fixture,
  expect,
} from '@open-wc/testing';

import '../../src/test-demo.js';

describe('Attributes', () => {
  describe('slotted', () => {
    it('Accepts Slots', async () => {
      const foo = 1;
      const el = await fixture(html`<test-demo><p>TEST</p></test-demo>`);
      expect(el).dom.to.equal('<test-demo><p>TEST</p></test-demo>', {
        ignoreAttributes: [ 'title' ]
      });
    });
  })
});
