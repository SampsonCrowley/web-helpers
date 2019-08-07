/* eslint-disable no-unused-expressions */
import {
  html,
  fixture,
  expect,
} from '@open-wc/testing';

import {
  elementUpdated,
} from '@open-wc/testing-helpers';

import '../../src/snack-bar.js';

describe('Attributes', () => {
  describe('.title', () => {
    it('is empty by default', async () => {
      const el = await fixture('<snack-bar></snack-bar>');
      expect(el.title).to.eq('');
    });

    it('is is bound to the `title` attribute', async () => {
      const el = await fixture('<snack-bar title="test"></snack-bar>');
      expect(el.title).to.eq('test');

      el.title = "test 2"
      await elementUpdated(el)

      expect(el).dom.to.equal(`<snack-bar title="test 2"></snack-bar>`);
    });

    it('displays the title in an H2 tag', async () => {
      await Promise.all([
        '',
        'asdf',
        'testing !',
      ].map(async (title) => {
        const el = await fixture(`<snack-bar title="${title}"></snack-bar>`);
        expect(el).shadowDom.to.equal(`<h2>${title}</h2>`, {
          ignoreTags: ['div']
        });
      }))
    });
  })
});
