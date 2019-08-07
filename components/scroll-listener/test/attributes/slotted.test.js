/* eslint-disable no-unused-expressions */
import {
  html,
  fixture,
  expect,
} from '@open-wc/testing';

import '../../src/scroll-listener.js';

describe('Attributes', () => {
  describe('slotted', () => {
    it('Accepts Slots', async () => {
      const foo = 1;
      const el = await fixture(html`<scroll-listener><p>TEST</p></scroll-listener>`);
      expect(el).dom.to.equal('<scroll-listener><p>TEST</p></scroll-listener>', {
        ignoreAttributes: [ 'title' ]
      });
    });
  })
});
