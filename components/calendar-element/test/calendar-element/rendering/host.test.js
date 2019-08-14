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
    it('should be snapshotable', async function() {
      const el = await fixture('<calendar-element></calendar-element>');
      expect(el).shadowDom.to.equalSnapshot()

      const props = [
        [ 'selectedDate', new Date(2000, 0, 1) ],
        [ 'dayFormat',    'dd'                 ],
        [ 'headerFormat', 'yyyy-MM'            ],
        [ 'headerStyle',  'font-size: 10px'    ],
        [ 'labelFormat',  'EE'                 ],
      ]

      for(let i = 0; i < props.length; i++) {
        const [ prop, val ] = props[i]
        el[prop] = val
        await elementUpdated(el)
        expect(el).shadowDom.to.equalSnapshot()
      }
    })
  });
});
