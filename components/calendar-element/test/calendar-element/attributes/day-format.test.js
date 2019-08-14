/* eslint-disable no-unused-expressions */
import {
  html,
  fixture,
  expect,
} from '@open-wc/testing';

import {
  elementUpdated,
} from '@open-wc/testing-helpers';

import '../../../src/calendar-element';

describe('CalendarElement (<calendar-element></calendar-element>)', function() {
  describe('Attributes', function() {
    describe('.dayFormat', function() {
      it('is d by default', async function() {
        const el = await fixture('<calendar-element></calendar-element>');
        expect(el.dayFormat).to.be.a('String')
        expect(el.dayFormat).to.equal('d')
      });

      it('is is bound to the `day-format` attribute', async function() {
        const el = await fixture('<calendar-element day-format="MMMM"></calendar-element>');
        expect(el.dayFormat).to.equal("MMMM")

        el.dayFormat = 'yyyy-MM'
        await elementUpdated(el)
        expect(el).dom.to.equal(`<calendar-element day-format="yyyy-MM"></calendar-element>`);
        expect(el.getAttribute('day-format')).to.equal('yyyy-MM');
      });

      describe('when a valid format is entered', function() {
        const err = console.error
        let loggedError = null

        before(async () => {
          console.error = (e) => loggedError = e
        })

        after(async () => {
          console.error = err
        })

        it('is set to the provided format', async function() {
          const el = await fixture('<calendar-element day-format="MM"></calendar-element>');
          expect(loggedError).to.be.null
          expect(el.dayFormat).to.equal('MM')

          el.dayFormat = 'MM/yyyy'
          expect(loggedError).to.be.null
          expect(el.dayFormat).to.equal('MM/yyyy')
        });
      })

      describe('when an invalid format is entered', function() {
        const err = console.error
        let loggedError = null

        before(async () => {
          console.error = (e) => loggedError = e
        })

        beforeEach(async () => loggedError = null)

        after(async () => {
          console.error = err
        })

        it('is reset back to default', async function() {
          const el = await fixture('<calendar-element day-format="EE"></calendar-element>');
          expect(el.dayFormat).to.equal('EE')

          el.dayFormat = 'YYYY'
          expect(el.dayFormat).to.equal('d')
        });

        it('Logs a RangeError', async function() {
          await fixture('<calendar-element day-format="YYYY"></calendar-element>');
          expect(loggedError).to.be.an.instanceOf(RangeError)
          expect(loggedError.message).to.include('formatting years')
        })
      })
    })
  });
});
