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
    describe('.dayFormat', () => {
      it('is d by default', async () => {
        const el = await fixture('<calendar-element></calendar-element>');
        expect(el.dayFormat).to.be.a('String')
        expect(el.dayFormat).to.eq('d')
      });

      it('is is bound to the `day-format` attribute', async () => {
        const el = await fixture('<calendar-element day-format="MMMM"></calendar-element>');
        expect(el.dayFormat).to.eq("MMMM")

        el.dayFormat = 'yyyy-MM'
        await elementUpdated(el)
        expect(el).dom.to.equal(`<calendar-element day-format="yyyy-MM"></calendar-element>`);
        expect(el.getAttribute('day-format')).to.equal('yyyy-MM');
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
          const el = await fixture('<calendar-element day-format="MM"></calendar-element>');
          expect(loggedError).to.be.null
          expect(el.dayFormat).to.eq('MM')

          el.dayFormat = 'MM/yyyy'
          expect(loggedError).to.be.null
          expect(el.dayFormat).to.eq('MM/yyyy')
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
          const el = await fixture('<calendar-element day-format="EE"></calendar-element>');
          expect(el.dayFormat).to.eq('EE')

          el.dayFormat = 'YYYY'
          expect(el.dayFormat).to.eq('d')
        });

        it('Logs a RangeError', async () => {
          await fixture('<calendar-element day-format="YYYY"></calendar-element>');
          expect(loggedError).to.be.an.instanceOf(RangeError)
          expect(loggedError.message).to.include('formatting years')
        })
      })
    })
  });
});
