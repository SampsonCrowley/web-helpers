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

import '../../src/calendar-element';

describe('CalendarElement (<calendar-element></calendar-element>)', () => {
  describe('Events', () => {
    describe('date-change', () => {
      let el, firedEvent = null

      const create = () => fixture('<calendar-element></calendar-element>'),
            eventDidFire = (keep) => new Promise((resolve) => {
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
        el = await create()
        el.selectedDate = null
        await elementUpdated(el)
        el.addEventListener('date-change', eventFired)
      })

      afterEach(async () => {
        el.removeEventListener('date-change', eventFired)
        firedEvent = null
      })

      it('is fired when .selectedDate changes', async () => {
        let result
        const d = new Date,
              expectEvent = async () => {
                expect(result = await eventDidFire()).to.be.a('CustomEvent')
                expect(result.type).to.eq('date-change')
              },
              expectNull = async () => {
                expect(await eventDidFire()).to.be.null
              }

        el.selectedDate = d
        await expectEvent()

        el.headerFormat = 'MM yy'
        await expectNull()

        el.selectedDate = d
        await expectNull()

        el.selectedDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())
        await expectNull()

        el.selectedDate = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
        await expectEvent()

        el.selectedDate = null
        await expectEvent()

        el.selectedDate = null
        await expectNull()
      }).timeout(10000);

      describe('Properties', () => {
        let ev, date =

        beforeEach(async () => {
          el.selectedDate = new Date(2000,0,1)
          ev = await eventDidFire()
        })

        describe('.bubbles', () => {
          it('is true', async () => {
            expect(ev.bubbles).to.be.true
          })
        })

        describe('.composed', () => {
          it('is true', async () => {
            expect(ev.composed).to.be.true
          })
        })

        describe('.cancelable', () => {
          it('is true', async () => {
            expect(ev.cancelable).to.be.true
          })
        })

        // detail: { date: this.selectedDate, value: this.selectedDate ? dateFnsFormat(this.selectedDate, 'yyyy-MM-dd') : null },
        describe('.detail', () => {
          it("is an object", () => {
            expect(typeof ev.detail).to.eq('object')
          })

          describe('Properties', () => {
            describe('value', () => {
              context('when .selectedDate is set', () => {
                it("is a String", () => {
                  expect(typeof ev.detail.value).to.eq('string')
                })

                it("is the current .selectedDate in ISO 8601 format (yyyy-MM-dd)", () => {
                  expect(ev.detail.value).to.eq('2000-01-01')
                })
              })

              context('when .selectedDate is unset', () => {
                beforeEach(async () => {
                  el.selectedDate = null
                  ev = await eventDidFire()
                })

                it("is null", () => {
                  expect(ev.detail.value).to.be.null
                })
              })
            })

            describe('date', () => {
              context('when .selectedDate is set', () => {
                it("is a Date", () => {
                  expect(typeof ev.detail.date).to.eq('object')
                  expect(ev.detail.date instanceof Date).to.be.true
                })

                it("is the current .selectedDate", () => {
                  expect(ev.detail.date).to.eq(el.selectedDate)
                })
              })

              context('when .selectedDate is unset', () => {
                beforeEach(async () => {
                  el.selectedDate = null
                  ev = await eventDidFire()
                })

                it("is null", () => {
                  expect(ev.detail.date).to.be.null
                })
              })
            })
          })
        })
      })
    })
  });
});
