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

import '../../../src/calendar-element';

describe('CalendarElement (<calendar-element></calendar-element>)', function() {
  describe('Events', function() {
    describe('date-change', function() {
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

      it('is fired when .selectedDate changes', async function() {
        let result
        const d = new Date,
              expectEvent = async () => {
                expect(result = await eventDidFire()).to.be.a('CustomEvent')
                expect(result.type).to.equal('date-change')
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

      describe('Properties', function() {
        let ev

        beforeEach(async () => {
          el.selectedDate = new Date(2000,0,1)
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
              context('when .selectedDate is set', function() {
                it("is a String", async function() {
                  expect(typeof ev.detail.value).to.equal('string')
                })

                it("is the current .selectedDate in ISO 8601 format (yyyy-MM-dd)", async function() {
                  expect(ev.detail.value).to.equal('2000-01-01')
                })
              })

              context('when .selectedDate is unset', function() {
                beforeEach(async () => {
                  el.selectedDate = null
                  ev = await eventDidFire()
                })

                it("is null", async function() {
                  expect(ev.detail.value).to.be.null
                })
              })
            })

            describe('date', function() {
              context('when .selectedDate is set', function() {
                it("is a Date", async function() {
                  expect(typeof ev.detail.date).to.equal('object')
                  expect(ev.detail.date instanceof Date).to.be.true
                })

                it("is the current .selectedDate", async function() {
                  expect(ev.detail.date).to.equal(el.selectedDate)
                })
              })

              context('when .selectedDate is unset', function() {
                beforeEach(async () => {
                  el.selectedDate = null
                  ev = await eventDidFire()
                })

                it("is null", async function() {
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
