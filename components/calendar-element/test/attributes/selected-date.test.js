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
    describe('.selectedDate', () => {
      it('is empty by default', async () => {
        const el = await fixture('<calendar-element></calendar-element>');
        expect(el.selectedDate).to.eq(null);
      });

      it('is is bound to the `selected-date` attribute', async () => {
        const el = await fixture('<calendar-element selected-date="12/19/1991"></calendar-element>');
        expect(el.selectedDate instanceof Date).to.eq(true)

        el.selectedDate = new Date(2000,0,1)
        await elementUpdated(el)
        expect(el).dom.to.equal(`<calendar-element selected-date="2000-01-01"></calendar-element>`);
        expect(el.getAttribute('selected-date')).to.equal('2000-01-01');
      });

      it('is requires a valid date or date format', async () => {
        const el = await fixture('<calendar-element selected-date="asdf"></calendar-element>');
        expect(el.selectedDate).to.eq(null)

        el.selectedDate = new Date(NaN)
        expect(el.selectedDate).to.eq(null)
      });

      it('is set by clicking a date cell', async () => {
        const el = await fixture('<calendar-element></calendar-element>');
        expect(el.selectedDate).to.eq(null)

        const clickable = el.shadowRoot.querySelector('calendar-element-body').shadowRoot.querySelector('ul.day-grid li.clickable');
        clickable.click()

        expect(el.selectedDate).to.not.eq(null)
        expect(+el.selectedDate).to.eq(+clickable.dataset.date)
      });
    })
  });
});
