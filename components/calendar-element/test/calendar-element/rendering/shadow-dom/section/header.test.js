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
        describe('header', function() {
          let el, section, header
          const retrieveElements = async () => {
            await elementUpdated(el)
            section = el.shadowRoot.querySelector('section')
            header = section.querySelector('header')
            expect(header).to.not.be.null
          }

          beforeEach(async () => {
            el = await fixture('<calendar-element></calendar-element>');
            await retrieveElements()
          })

          it('should contain exactly 2 nav buttons', async function() {
            expect(header.querySelectorAll('.calendar-nav').length).to.equal(2)
          })

          it('should conain the formatted header', async function() {
            const d = el._currentMonth
            expect(header.querySelectorAll('span').length).to.equal(1)
            expect(header.querySelector('span')).dom.to.equal(`<span>${d.toLocaleString('en-US', { month: 'long' })} ${d.getFullYear()}</span>`)
          })

          describe('nav buttons', function() {
            it('should contain a clickable material-design icon', async function() {
              header.querySelectorAll('.calendar-nav').forEach(btn => {
                const icons = btn.querySelectorAll('i'),
                      icon = icons[0]
                expect(icons.length).to.equal(1)
                expect(icon.classList.contains('material-icons')).to.be.true
                expect(icon.classList.contains('clickable')).to.be.true
              })
            })

            it('should change the visible month', async function() {
              const btns = header.querySelectorAll('.calendar-nav')
              for (let i = 0; i < btns.length; i++) {
                const currentMonth = el._currentMonth,
                      btn = btns[i]

                btn.click()
                await retrieveElements()

                expect(el._currentMonth).to.be[/previous/.test(btn.dataset.function) ? 'below' : 'above'](currentMonth)
              }
            })
          })
        })
      })
    })
  });
});
