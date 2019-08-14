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

import '../../../../../src/calendar-element';
import { CalendarElementBody } from '../../../../../src/calendar-element-body';

describe('CalendarElement (<calendar-element></calendar-element>)', function() {
  describe('Rendering', function() {
    describe('shadowDom', function() {
      describe('section', function() {
        describe('calendar-element-body', function() {
          let el, section, calendarBody
          const retrieveElements = async () => {
            await elementUpdated(el)
            section = el.shadowRoot.querySelector('section')
            calendarBody = section.querySelector('calendar-element-body')
            expect(calendarBody).to.not.be.null
          }

          beforeEach(async () => {
            el = await fixture('<calendar-element></calendar-element>');
            await retrieveElements()
          })

          it('should be a custom element', async function() {
            expect(calendarBody.tagName).to.include('-')
            expect(customElements.get(calendarBody.tagName.toLowerCase())).to.equal(CalendarElementBody)
          })

          it('should be passed properties from the current state', async function() {
            const props = [
              [ 'startDate', '_bodyStartDate' ],
              [ 'endDate', '_bodyEndDate' ],
              [ 'currentMonth', '_currentMonth' ],
              [ 'selectedDate', 'selectedDate' ],
              [ 'dayFormat', 'dayFormat' ],
            ]
            for(let i = 0; i < props.length; i++) {
              const [ prop, passed ] = props[i]
              expect(calendarBody[prop]).to.equal(el[passed])
            }
          })
        })
      })
    })
  });
});
