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

describe('CalendarElement (<calendar-element></calendar-element>)', function() {
  describe('Rendering', function() {
    describe('shadowDom', function() {
      describe('section', function() {
        describe('ul.weekdays', function() {
          let el, section, weekdays
          const retrieveElements = async () => {
            await elementUpdated(el)
            section = el.shadowRoot.querySelector('section')
            weekdays = section.querySelector('.weekdays')
            expect(weekdays).to.not.be.null
          }

          beforeEach(async () => {
            el = await fixture('<calendar-element></calendar-element>');
            await retrieveElements()
          })

          it('should be an unordered list', async function() {
            expect(weekdays.tagName).to.equal('UL')
          })

          it('should contain exactly 7 list items', async function() {
            expect(weekdays.querySelectorAll('li').length).to.equal(7)
          })

          it('should display all 7 days in an abbr tag', async function() {
            expect(weekdays.querySelectorAll('li > abbr').length).to.equal(7)
          })

          it('should have the shorthand day name as the title and the day format as the element text', async function() {
            let tags = weekdays.querySelectorAll('li > abbr'),
                  days = [
                    'Sunday',
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                  ]
            for (let i = 0; i < Math.max(days.length, tags.length); i++) {
              const tag = tags[i] || {},
                    day = days[i] || 'UNKNOWN'
              expect(tag.innerText).to.equal(day)
              expect(tag.title).to.equal(day.slice(0, 2))
            }

            el.labelFormat = 'EEEEEE'
            await retrieveElements()
            tags = weekdays.querySelectorAll('li > abbr')
            for (let i = 0; i < Math.max(days.length, tags.length); i++) {
              const tag = tags[i] || {},
                    day = days[i] || 'UNKNOWN'
              expect(tag.innerText).to.equal(day.slice(0, 2))
              expect(tag.title).to.equal(day.slice(0, 2))
            }
          })
            // expect(weekdays).dom.to.equal(`
            //   <ul class="weekdays">
            //     <li>
            //       <abbr title="Su">
            //         Sunday
            //       </abbr>
            //     </li>
            //     <li>
            //       <abbr title="Mo">
            //         Monday
            //       </abbr>
            //     </li>
            //     <li>
            //       <abbr title="Tu">
            //         Tuesday
            //       </abbr>
            //     </li>
            //     <li>
            //       <abbr title="We">
            //         Wednesday
            //       </abbr>
            //     </li>
            //     <li>
            //       <abbr title="Th">
            //         Thursday
            //       </abbr>
            //     </li>
            //     <li>
            //       <abbr title="Fr">
            //         Friday
            //       </abbr>
            //     </li>
            //     <li>
            //       <abbr title="Sa">
            //         Saturday
            //       </abbr>
            //     </li>
            //   </ul>
            // `)
        })
      })
    })
  });
});
