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
    describe('.headerFormat', () => {
      it('is MMMM yyyy by default', async () => {
        const el = await fixture('<calendar-element></calendar-element>');
        expect(el.headerFormat).to.be.a('String')
        expect(el.headerFormat).to.eq('MMMM yyyy')
      });

      it('is is bound to the `header-format` attribute', async () => {
        const el = await fixture('<calendar-element header-format="MMMM"></calendar-element>');
        expect(el.headerFormat).to.eq("MMMM")

        el.headerFormat = 'yyyy-MM'
        await elementUpdated(el)
        expect(el).dom.to.equal(`<calendar-element header-format="yyyy-MM"></calendar-element>`);
        expect(el.getAttribute('header-format')).to.equal('yyyy-MM');
      });

      describe('when a valid format is entered', () => {
        const err = console.error
        let loggedError = null

        before(async () => {
          console.error = (e) => loggedError = e
        })

        after(async () => {
          console.error = err
        })

        it('is reset back to default', async () => {
          const el = await fixture('<calendar-element header-format="MM"></calendar-element>');
          expect(loggedError).to.be.null
          expect(el.headerFormat).to.eq('MM')

          el.headerFormat = 'MM/yyyy'
          expect(loggedError).to.be.null
          expect(el.headerFormat).to.eq('MM/yyyy')
        });
      })

      describe('when an invalid format is entered', () => {
        const err = console.error
        let loggedError = null

        before(async () => {
          console.error = (e) => loggedError = e
        })

        beforeEach(async () => loggedError = null)

        after(async () => {
          console.error = err
        })

        it('is reset back to default', async () => {
          const el = await fixture('<calendar-element header-format="MM"></calendar-element>');
          expect(el.headerFormat).to.eq('MM')

          el.headerFormat = 'MM/YYYY'
          expect(el.headerFormat).to.eq('MMMM yyyy')
        });

        it('Logs a RangeError', async () => {
          await fixture('<calendar-element header-format="MM/YYYY"></calendar-element>');
          expect(loggedError).to.be.an.instanceOf(RangeError)
          expect(loggedError.message).to.include('formatting years')
        })
      })
    })
  });
});
