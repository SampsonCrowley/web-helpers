/* eslint-disable no-unused-expressions */
import {
  html,
  fixture,
  expect,
} from '@open-wc/testing';

import {
  elementUpdated,
} from '@open-wc/testing-helpers';

import '../../src/register-calendar-helper.js';

describe('Attributes', () => {
  describe('.title', () => {
    it('is empty by default', async () => {
      const el = await fixture('<calendar-helper></calendar-helper>');
      expect(el.title).to.eq('');
    });

    it('is is bound to the `title` attribute', async () => {
      const el = await fixture('<calendar-helper title="test"></calendar-helper>');
      expect(el.title).to.eq('test');

      el.title = "test 2"
      await elementUpdated(el)

      expect(el).dom.to.equal(`<calendar-helper title="test 2"></calendar-helper>`);
    });

    it('displays the title in an H2 tag', async () => {
      await Promise.all([
        '',
        'asdf',
        'testing !',
      ].map(async (title) => {
        const el = await fixture(`<calendar-helper title="${title}"></calendar-helper>`);
        expect(el).shadowDom.to.equal(`<h2>${title}</h2>`, {
          ignoreTags: ['div']
        });
      }))
    });
  })
});
