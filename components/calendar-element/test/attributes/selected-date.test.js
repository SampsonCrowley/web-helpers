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
        expect(el.selectedDate).to.be.null
      });

      it('is is bound to the `selected-date` attribute', async () => {
        const el = await fixture('<calendar-element selected-date="12/19/1991"></calendar-element>');
        expect(el.selectedDate).to.be.an.instanceOf(Date)
        expect(el.selectedDate.toISOString()).to.eq(new Date(1991, 11, 19).toISOString())

        el.selectedDate = new Date(2000,0,1)
        await elementUpdated(el)
        expect(el).dom.to.equal(`<calendar-element selected-date="2000-01-01"></calendar-element>`);
        expect(el.getAttribute('selected-date')).to.equal('2000-01-01');
      });

      it('is set by clicking a date cell', async () => {
        const el = await fixture('<calendar-element></calendar-element>'),
              clickable = el.shadowRoot.querySelector('calendar-element-body').shadowRoot.querySelectorAll('ul.day-grid li.clickable.current-month');

        for(let i = 0; i < clickable.length; i++) {
          clickable[i].click()
          expect(el.selectedDate).to.not.eq(null)
          expect(+el.selectedDate).to.eq(+clickable[i].dataset.date)
        }

        expect(el.selectedDate).to.not.eq(null)
      });

      context('when an invalid date is entered', () => {
        const err = console.error
        let loggedError = null

        before(async () => {
          console.error = (e) => loggedError = e
        })

        beforeEach(async () => loggedError = null)

        after(async () => {
          console.error = err
        })

        it('sets the value to NULL', async () => {
          const el = await fixture('<calendar-element selected-date="2019-01-01"></calendar-element>');
          expect(el.selectedDate).to.not.be.null

          el.selectedDate = new Date(NaN)
          expect(el.selectedDate).to.be.null
        });

        it('Logs the invalid date as an Error', async () => {
          const el = await fixture('<calendar-element selected-date="asdf"></calendar-element>');
          expect(loggedError).to.be.an.instanceOf(Error)
          expect(loggedError.message).to.include('Invalid Format')
        });
      })
    })
  });
});
