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
    describe('.headerFormat', function() {
      it('is MMMM yyyy by default', async function() {
        const el = await fixture('<calendar-element></calendar-element>');
        expect(el.headerFormat).to.be.a('String')
        expect(el.headerFormat).to.equal('MMMM yyyy')
      });

      it('is is bound to the `header-format` attribute', async function() {
        const el = await fixture('<calendar-element header-format="MMMM"></calendar-element>');
        expect(el.headerFormat).to.equal("MMMM")

        el.headerFormat = 'yyyy-MM'
        await elementUpdated(el)
        expect(el).dom.to.equal(`<calendar-element header-format="yyyy-MM"></calendar-element>`);
        expect(el.getAttribute('header-format')).to.equal('yyyy-MM');
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

        it('is set to the provided value', async function() {
          const el = await fixture('<calendar-element header-format="MM"></calendar-element>');
          expect(loggedError).to.be.null
          expect(el.headerFormat).to.equal('MM')

          el.headerFormat = 'MM/yyyy'
          expect(loggedError).to.be.null
          expect(el.headerFormat).to.equal('MM/yyyy')
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
          const el = await fixture('<calendar-element header-format="MM"></calendar-element>');
          expect(el.headerFormat).to.equal('MM')

          el.headerFormat = 'MM/YYYY'
          expect(el.headerFormat).to.equal('MMMM yyyy')
        });

        it('Logs a RangeError', async function() {
          await fixture('<calendar-element header-format="MM/YYYY"></calendar-element>');
          expect(loggedError).to.be.an.instanceOf(RangeError)
          expect(loggedError.message).to.include('formatting years')
        })
      })
    })
  });
});
