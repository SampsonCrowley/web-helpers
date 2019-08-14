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
  describe('Rendering', function() {
    describe('shadowDom', function() {
      it('should be its own section', async function() {
        const el = await fixture('<calendar-element></calendar-element>')

        for(let i = 0; i < el.shadowRoot.children.length; i++) {
          if(i) {
            expect(el.shadowRoot.children[i].tagName).to.equal('STYLE')
          } else {
            expect(el.shadowRoot.children[i].tagName).to.equal('SECTION')
            expect(el.shadowRoot.children[i].id).to.equal('calendar-element-section-wrapper')
          }
        }
      })
    })
  });
});
