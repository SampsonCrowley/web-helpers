/* eslint-disable no-unused-expressions */
import {
  html,
  fixture,
  expect,
} from '@open-wc/testing';

import {
  elementUpdated,
} from '@open-wc/testing-helpers';

import '../../src/test-demo.js';

describe('Attributes', () => {
  describe('.title', () => {
    it('is empty by default', async () => {
      const el = await fixture('<test-demo></test-demo>');
      expect(el.title).to.eq('');
    });

    it('is is bound to the `title` attribute', async () => {
      const el = await fixture('<test-demo title="test"></test-demo>');
      expect(el.title).to.eq('test');

      el.title = "test 2"
      await elementUpdated(el)

      expect(el).dom.to.equal(`<test-demo title="test 2"></test-demo>`);
    });

    it('displays the title in an H2 tag', async () => {
      await Promise.all([
        '',
        'asdf',
        'testing !',
      ].map(async (title) => {
        const el = await fixture(`<test-demo title="${title}"></test-demo>`);
        expect(el).shadowDom.to.equal(`<h2>${title}</h2>`, {
          ignoreTags: ['div']
        });
      }))
    });
  })
});
