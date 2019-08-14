/* eslint-disable no-unused-expressions */
import {
  html,
  fixture,
  expect,
  oneEvent
} from '@open-wc/testing';

import {
  elementUpdated,
} from '@open-wc/testing-helpers';

import '../../../../src/calendar-element';

describe('CalendarElement (<calendar-element></calendar-element>)', function() {
  describe('Rendering', function() {
    describe('shadowDom', function() {
      describe('section', function() {
        let el, section
        beforeEach(async () => {
          el = await fixture('<calendar-element></calendar-element>');
          section = el.shadowRoot.querySelector('section')
          expect(section).to.not.be.null
          expect(el.shadowRoot.querySelectorAll('section').length).to.equal(1)
        })

        it('should have an ID for easier access', async function() {
          expect(section.id).to.be.a('String')
          expect(section.id).to.equal('calendar-element-section-wrapper')
        })

        it('should be semantically valid', async function() {
          expect(section.querySelector(':scope > header')).to.not.be.null
          expect(section.querySelectorAll(':scope > header').length).to.equal(1)
        })

        it('should contain a weekdays list', async function() {
          expect(section.querySelector('.weekdays')).to.not.be.null
          expect(section.querySelectorAll('.weekdays').length).to.equal(1)
          expect(section.querySelector('.weekdays').cloneNode(false)).dom.to.equal('<ul class="weekdays">')
        })

        it('should contain the calendar body', async function() {
          expect(section.querySelector('calendar-element-body')).to.not.be.null
          expect(section.querySelectorAll('calendar-element-body').length).to.equal(1)
        })
      })
    })
  });
});
