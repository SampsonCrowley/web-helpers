/* eslint-disable no-unused-expressions */
import {
  html,
  fixture,
  expect,
} from '@open-wc/testing';

import {
  elementUpdated,
} from '@open-wc/testing-helpers';

import '../../src/scroll-listener.js';

describe('Attributes', () => {
  describe('.title', () => {
    it('is empty by default', async () => {
      const el = await fixture('<scroll-listener></scroll-listener>');
      expect(el.title).to.eq('');
    });

    it('is is bound to the `title` attribute', async () => {
      const el = await fixture('<scroll-listener title="test"></scroll-listener>');
      expect(el.title).to.eq('test');

      el.title = "test 2"
      await elementUpdated(el)

      expect(el).dom.to.equal(`<scroll-listener title="test 2"></scroll-listener>`);
    });

    it('displays the title in an H2 tag', async () => {
      await Promise.all([
        '',
        'asdf',
        'testing !',
      ].map(async (title) => {
        const el = await fixture(`<scroll-listener title="${title}"></scroll-listener>`);
        expect(el).shadowDom.to.equal(`<h2>${title}</h2>`, {
          ignoreTags: ['div']
        });
      }))
    });
  })
});
