import {
  create,
  expect,
} from '../../../calendar-element-body-helper';

import { format } from 'date-fns'

describe('CalendarElementBody (<calendar-element-body></calendar-element-body>)', function() {
  describe('Rendering', function() {
    describe('shadowDom', function() {
      describe('ul', function() {
        describe('li', function(){
          let el, ul, items

          const getElement = async (options = {}) => {
            el = await create({
              startDate: new Date(2000,0,1),
              endDate: new Date(2000,11,31),
              selectedDate: new Date(2000, 3, 1),
              currentMonth: new Date(2000, 3, 1),
              ...options
            });
            ul = el.shadowRoot.querySelector('ul.day-grid')
            items = ul.querySelectorAll('li')

            return {
              el,
              ul,
              items
            }
          }

          beforeEach(async function () {
            await getElement()
            expect(items.length).to.be.equal(366)
          })

          it('should have the date as an integer in dataset', async function() {
            let currentDate = +el.startDate
            const minute = 60 * 1000,
                  hour = minute * 60,
                  day = hour * 24

            const satisfied = (item) => {
              if(!item.dataset) return false
              if(!item.dataset.date) return false
              const v = +item.dataset.date
              return v === currentDate
            }

            const nextDate = () => {
              const newDate = new Date(currentDate + day),
                    oldDate = new Date(currentDate),
                    addHours = (newDate.getTimezoneOffset() - oldDate.getTimezoneOffset()) * minute
              currentDate = +currentDate + day + addHours
            }

            for(let i = 0; i < items.length; i++) {
              expect(+items[i].dataset.date).to.equal(currentDate)
              nextDate()
            }
          })

          it('should have the formatted date as `display` in dataset', async function() {
            for(let i = 0; i < items.length; i++) {
              expect(items[i].dataset.display).to.equal(format(new Date(+items[i].dataset.date), el.dayFormat))
            }
          })

          it('should be either the other month, selected date, or current month', async function() {
            const satisfied = (li) => li.classList.contains('other-month') || li.classList.contains('selected-date') || li.classList.contains('current-month')
            for(let i = 0; i < items.length; i++) {
              const li = items[i]
              expect(items[i]).to.satisfy(satisfied)
            }
          })

          it('shows the selected date if it is the current month', async function() {
            let li = ul.querySelector('li.selected-date')
            expect(li).to.not.be.null
            expect(+li.dataset.date).to.equal(+el.selectedDate)

            await getElement({
              selectedDate: new Date(2000, 2,1)
            })

            li = ul.querySelector('li.selected-date')
            expect(li).to.be.null
          })

          it('should contain an <abbr> tag', async function() {
            for(let i = 0; i < items.length; i++) {
              expect(items[i].querySelectorAll('abbr')).to.have.a.lengthOf(1)
            }
          })

          it('should have the full date as a title on the <abbr> tag', async function() {
            for(let i = 0; i < items.length; i++) {
              expect(items[i].querySelector('abbr').title).to.match(/[A-Z][a-z]+ \d{1,2}[a-z]{2}, \d{4}/)
            }
          })

          it('should have the formatted date as the text content', async function() {
            for(let i = 0; i < items.length; i++) {
              expect(items[i].innerText).to.equal(items[i].dataset.display)
            }
          })
        })
      })
    })
  });
});
