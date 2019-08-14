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
    describe('.labelFormat', function() {
      it('is EEEE by default', async function() {
        const el = await fixture('<calendar-element></calendar-element>');
        expect(el.labelFormat).to.be.a('String')
        expect(el.labelFormat).to.equal('EEEE')
      });

      it('is is bound to the `label-format` attribute', async function() {
        const el = await fixture('<calendar-element label-format="MMMM"></calendar-element>');
        expect(el.labelFormat).to.equal("MMMM")

        el.labelFormat = 'yyyy-MM'
        await elementUpdated(el)
        expect(el).dom.to.equal(`<calendar-element label-format="yyyy-MM"></calendar-element>`);
        expect(el.getAttribute('label-format')).to.equal('yyyy-MM');
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
          const el = await fixture('<calendar-element label-format="MM"></calendar-element>');
          expect(loggedError).to.be.null
          expect(el.labelFormat).to.equal('MM')

          el.labelFormat = 'MM/yyyy'
          expect(loggedError).to.be.null
          expect(el.labelFormat).to.equal('MM/yyyy')
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
          const el = await fixture('<calendar-element label-format="EE"></calendar-element>');
          expect(el.labelFormat).to.equal('EE')

          el.labelFormat = 'YYYY'
          expect(el.labelFormat).to.equal('EEEE')
        });

        it('Logs a RangeError', async function() {
          await fixture('<calendar-element label-format="YYYY"></calendar-element>');
          expect(loggedError).to.be.an.instanceOf(RangeError)
          expect(loggedError.message).to.include('formatting years')
        })
      })
    })
  });
});
