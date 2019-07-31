/* eslint-disable no-unused-expressions */
import {
  html,
  fixture,
  expect,
} from '@open-wc/testing';

import '../../src/register-calendar-helper.js';

describe('Attributes', () => {
  describe('slotted', () => {
    it('Accepts Slots', async () => {
      const foo = 1;
      const el = await fixture(html`<calendar-helper><p>TEST</p></calendar-helper>`);
      expect(el).dom.to.equal('<calendar-helper><p>TEST</p></calendar-helper>', {
        ignoreAttributes: [ 'title' ]
      });
    });
  })
});
