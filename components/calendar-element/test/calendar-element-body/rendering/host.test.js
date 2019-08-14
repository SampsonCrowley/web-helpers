/* eslint-disable no-unused-expressions */
import {
  create,
  elementUpdated,
  expect,
} from '../calendar-element-body-helper';

import '../../../src/calendar-element-body';

describe('CalendarElementBody (<calendar-element-body></calendar-element-body>)', function() {
  describe('Rendering', function() {
    it('should be snapshotable', async function() {
      const el = await create({});
      expect(el).shadowDom.to.equalSnapshot()
      const props = [
        [ 'startDate',    new Date(2000, 0, 3)  ],
        [ 'endDate',      new Date(2000, 1, 31) ],
        [ 'currentMonth', new Date(2000, 1, 1)  ],
        [ 'selectedDate', new Date(2000, 1, 5)  ],
        [ 'dayFormat',    'dd'                  ],
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
