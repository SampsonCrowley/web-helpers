/* eslint-disable no-unused-expressions */
import {
  create,
  expect,
} from '../../calendar-element-body-helper';

describe('CalendarElementBody (<calendar-element-body></calendar-element-body>)', function() {
  describe('Rendering', function() {
    describe('shadowDom', function() {
      describe('ul', function() {
        let el, ul
        beforeEach(async function() {
          el = await create({});
          ul = el.shadowRoot.querySelector('ul')
          expect(ul).to.not.be.null
          expect(el.shadowRoot.querySelectorAll('ul').length).to.equal(1)
        })

        it('should be a day-grid', async function() {
          expect(ul.classList.contains('day-grid')).to.be.true
        })

        it('should be contain a list of days', async function() {
          expect(ul.querySelector(':scope > li')).to.not.be.null
          expect(ul.querySelectorAll(':scope > li').length).to.equal(Math.round((el.endDate - el.startDate) / (1000 * 60 * 60 * 24)) + 1)
          expect(ul.querySelectorAll(':scope > li').length).to.equal(el.shadowRoot.querySelectorAll('li').length)
        })
      })
    })
  });
});
