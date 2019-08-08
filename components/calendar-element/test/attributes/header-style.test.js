/* eslint-disable no-unused-expressions */
import {
  html,
  fixture,
  expect,
} from '@open-wc/testing';

import {
  elementUpdated,
} from '@open-wc/testing-helpers';

import '../../src/calendar-element';

describe('CalendarElement (<calendar-element></calendar-element>)', () => {
  describe('Attributes', () => {
    describe('.headerStyle', () => {
      it('is an empty string by default', async () => {
        const el = await fixture('<calendar-element></calendar-element>');
        expect(el.headerStyle).to.be.a('String')
        expect(el.headerStyle).to.eq('')
      });

      it('is is bound to the `header-style` attribute', async () => {
        const el = await fixture('<calendar-element header-style="top: 20px"></calendar-element>');
        expect(el.headerStyle).to.eq("top: 20px")

        el.headerStyle = 'margin: 4rem'
        await elementUpdated(el)
        expect(el).dom.to.equal(`<calendar-element header-style="margin: 4rem"></calendar-element>`);
        expect(el.getAttribute('header-style')).to.equal('margin: 4rem');
      });

      it('is cooerced to an unvalidated string', async () => {
        const el = await fixture('<calendar-element></calendar-element>');
        const d = new Date()
        el.headerStyle = d
        await elementUpdated(el)
        expect(el.headerStyle).to.eq(String(d))
        expect(el).dom.to.equal(`<calendar-element header-style="${String(d)}"></calendar-element>`);
      })

      it('is rendered in the section header', async () => {
        const el = await fixture('<calendar-element header-style="top: 20px"></calendar-element>');
        expect(el.shadowRoot.querySelector('header')).dom.to.eq(`<header style="top: 20px">`, {
          ignoreTags: ['div', 'span']
        });
      })
    })
  });
});
