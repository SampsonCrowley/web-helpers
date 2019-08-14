/* eslint-disable no-unused-expressions */
import {
  create,
  expect,
} from '../calendar-element-body-helper';

describe('CalendarElementBody (<calendar-element-body></calendar-element-body>)', function() {
  describe('Rendering', function() {
    describe('shadowDom', function() {
      it('should be an unordered list', async function() {
        const el = await create({});

        for(let i = 0; i < el.shadowRoot.children.length; i++) {
          if(i) {
            expect(el.shadowRoot.children[i].tagName).to.equal('STYLE')
          } else {
            expect(el.shadowRoot.children[i].tagName).to.equal('UL')
            expect(el.shadowRoot.children[i].classList.contains('day-grid')).to.be.true
          }
        }
      })
    })
  });
});
