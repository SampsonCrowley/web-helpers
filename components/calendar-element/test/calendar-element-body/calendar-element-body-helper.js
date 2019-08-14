import {
  html,
  fixture,
  expect,
  oneEvent
} from '@open-wc/testing';

import {
  elementUpdated,
} from '@open-wc/testing-helpers';

import { CalendarElementBody } from '../../src/calendar-element-body';

const create = ({
  startDate = new Date(2000, 0, 1),
  endDate = new Date(2000, 0, 31),
  currentMonth = new Date(2000, 0, 1),
  selectedDate = null,
  dayFormat = 'd',
}) => fixture(html`
  <calendar-element-body
    .startDate=${startDate}
    .endDate=${endDate}
    .currentMonth=${currentMonth}
    .selectedDate=${selectedDate}
    .dayFormat=${dayFormat}
  ></calendar-element-body>
`)


export {
  create,
  elementUpdated,
  expect,
  fixture,
  html,
  oneEvent,
}
