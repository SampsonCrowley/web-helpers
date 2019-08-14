/* eslint-disable no-unused-expressions */
import {
  create,
  elementUpdated,
  expect,
} from '../calendar-element-body-helper';

import '../../../src/calendar-element-body';

describe('CalendarElementBody (<calendar-element-body></calendar-element-body>)', function() {
  describe('Events', function() {
    describe('date-clicked', function() {
      let el, firedEvent = null
      const eventDidFire = (keep) => new Promise((resolve) => {
              const startedAt = new Date

              const loop = () => {
                if(firedEvent || ((new Date - startedAt) > 500)) {
                  const result = firedEvent
                  if(!keep) firedEvent = null
                  return resolve(result)
                }
                setTimeout(loop)
              }

              return loop()
            }),
            eventFired = (ev) => firedEvent = ev


      beforeEach(async () => {
        el = await create({})
        el.selectedDate = null
        await elementUpdated(el)
        el.addEventListener('date-clicked', eventFired)
      })

      afterEach(async () => {
        el.removeEventListener('date-clicked', eventFired)
        firedEvent = null
      })

      it('is fired when any day is clicked', async function() {
        let result
        const expectEvent = async () => {
                expect(result = await eventDidFire()).to.be.a('CustomEvent')
                expect(result.type).to.equal('date-clicked')
              },
              expectNull = async () => {
                expect(await eventDidFire()).to.be.null
              },
              days = el.shadowRoot.querySelectorAll('li.current-month')

        expect(days.length).to.equal(31)

        for(let i = 0; i < days.length; i++) {
          days[i].click()
          await expectEvent()
        }

        el.shadowRoot.querySelector('ul.day-grid').click()
        await expectNull()
      }).timeout(10000);

      describe('Properties', function() {
        let ev, day, date

        beforeEach(async () => {
          day = el.shadowRoot.querySelector('li.current-month')
          date = new Date(+day.dataset.date)
          day.click()
          ev = await eventDidFire()
        })

        describe('.bubbles', function() {
          it('is true', async function() {
            expect(ev.bubbles).to.be.true
          })
        })

        describe('.composed', function() {
          it('is true', async function() {
            expect(ev.composed).to.be.true
          })
        })

        describe('.cancelable', function() {
          it('is true', async function() {
            expect(ev.cancelable).to.be.true
          })
        })

        // detail: { date: this.selectedDate, value: this.selectedDate ? dateFnsFormat(this.selectedDate, 'yyyy-MM-dd') : null },
        describe('.detail', function() {
          it("is an object", async function() {
            expect(typeof ev.detail).to.equal('object')
          })

          describe('Properties', function() {
            describe('value', function() {
              it("is a String", async function() {
                expect(typeof ev.detail.value).to.equal('string')
              })

              it("is the clicked date in ISO 8601 format (yyyy-MM-dd)", async function() {
                expect(ev.detail.value).to.match(/^\d{4}-\d{2}-\d{2}/)
              })
            })

            describe('date', function() {
              it("is a Date", async function() {
                expect(typeof ev.detail.date).to.equal('object')
                expect(ev.detail.date instanceof Date).to.be.true
              })

              it("is the clicked date", async function() {
                expect(ev.detail.date).to.deep.equal(date)
              })
            })
          })
        })
      })
    })
  });
});
