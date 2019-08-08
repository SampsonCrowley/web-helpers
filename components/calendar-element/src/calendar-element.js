import { LitElement, html } from 'lit-element';
import { CalendarStyles, SharedStyles } from '@web-helpers/styles'
import { DateSerializer, registerElement } from '@web-helpers/core'
// "date-fns": "^2.0.0-beta.3",
import {
  addDays as dateFnsAddDays,
  addMonths as dateFnsAddMonths,
  endOfMonth as dateFnsEndOfMonth,
  endOfWeek as dateFnsEndOfWeek,
  format as dateFnsFormat,
  isSameMonth as dateFnsIsSameMonth,
  startOfMonth as dateFnsStartOfMonth,
  startOfWeek as dateFnsStartOfWeek,
} from 'date-fns'

import { parseValidDate } from '@web-helpers/core'

import './calendar-element-body'
import './calendar-element-header'

const headerFormat = 'MMMM yyyy',
      labelFormat = "EEEE",
      dayFormat = 'd',
      weekdays = [...7].map(i => dateFnsAddDays(dateFnsStartOfWeek(new Date()), i))

export default class CalendarElement extends LitElement {
  static get properties() {
    return {
      selectedDate: {
        converter: DateSerializer,
        reflect: true,
      },
      dayFormat: {
        type: String,
        reflect: true
      },
      headerFormat: {
        type: String,
        reflect: true
      },
      labelFormat: {
        type: String,
        reflect: true
      },
      headerStyle: {
        type: String,
        reflect: true
      },
      _currentMonth: { attribute: false },
      _startDate: { attribute: false },
      _formattedMonth: { type: String },
      _startOfMonth: { attribute: false },
      _endOfMonth: { attribute: false },
      _bodyStartDate: { attribute: false },
      _bodyEndDate: { attribute: false },
      _weekdays: { attribute: false },
    };
  }

  static get styles() {
    return [
      SharedStyles,
      CalendarStyles,
    ]
  }

  static _attributeNameForProperty(property) {
    return property.replace(/([A-Z]+)/g, '-$1').toLowerCase();
  }

  constructor() {
    super()

    this._currentMonth = new Date()

    this._buildStateForMonth()
    this._buildWeekdays()
  }

  render() {
    return html`
      <section id="calendar-section-wrapper">
        <header style="${this.headerStyle || ''}">
          <div class="calendar-nav" data-function='previous-month' @click="${this._previousMonth}" >
            <i class="material-icons clickable">
              chevron_left
            </i>
          </div>

          <span>
            ${this._formattedMonth}
          </span>

          <div class="calendar-nav" data-function='previous-month' @click="${this._nextMonth}">
            <i class="material-icons clickable">
              chevron_right
            </i>
          </div>
        </header>

        <ul class="weekdays">
          ${this.weekdays}
        </ul>

        <calendar-element-body
          .startDate="${this._bodyStartDate}"
          .endDate="${this._bodyEndDate}"
          .currentMonth="${this._currentMonth}"
          .selectedDate="${this.selectedDate}"
          .dayFormat="${this.dayFormat}"
          @date-clicked=${this._onDateClick}
        ></calendar-element-body>
      </section>
    `
  }

  get weekdays() {
    return this._weekdays || this._buildWeekdays() || []
  }

  get selectedDate() {
    return this._selectedDate || null
  }

  set selectedDate(value) {
    const oldValue = this.selectedDate,
          newValue = parseValidDate(value),
          newFormatted = (newValue && dateFnsFormat(newValue, 'yyyy-MM-dd')),
          oldFormatted = (oldValue && dateFnsFormat(oldValue, 'yyyy-MM-dd'))

    if(newFormatted !== oldFormatted) {
      this._selectedDate = newValue

      this.requestUpdate('selectedDate', oldValue)

      if(this.selectedDate && !dateFnsIsSameMonth(this.selectedDate, this._startOfMonth)) {
        this._currentMonth = this.selectedDate
        this._buildStateForMonth()
      }

      this.dispatchEvent(
        new CustomEvent(
          'date-change',
          {
            detail: { date: this.selectedDate, value: this.selectedDate ? dateFnsFormat(this.selectedDate, 'yyyy-MM-dd') : null },
            bubbles: true,
            composed: true,
            cancelable: true,
          }
        )
      );
    }
  }

  get headerStyle() {
    return this._headerStyle || ''
  }

  set headerStyle(value) {
    const oldValue = this._headerStyle

    this._headerStyle = String(value || '')

    this.requestUpdate('headerStyle', oldValue)
  }

  get dayFormat() {
    return this._dayFormat || dayFormat
  }

  set dayFormat(value) {
    const oldValue = this._dayFormat

    this._dayFormat = String(value || '')
    try {
      dateFnsFormat(this._currentMonth, this._dayFormat)
    } catch (err) {
      console.error(err)
      this._dayFormat = null
    }


    this.requestUpdate('dayFormat', oldValue)
  }

  get headerFormat() {
    return this._headerFormat || headerFormat
  }

  set headerFormat(value) {
    const oldValue = this._headerFormat

    this._headerFormat = String(value || '')

    try {
      this._formattedMonth = this._calcHeaderText(this._currentMonth)
      this.requestUpdate('headerFormat', oldValue)
    } catch (err) {
      console.error(err)
      this._headerFormat = null
    }
  }

  get labelFormat() {
    return this._labelFormat || labelFormat
  }

  set labelFormat(value) {
    const oldValue = this._labelFormat

    this._labelFormat = String(value || '')

    try {
      this._buildWeekdays()
      this.requestUpdate('labelFormat', oldValue)
    } catch (err) {
      console.error(err)
      return this._labelFormat = null
    }
  }

  _calcHeaderText(date) {
    return dateFnsFormat(date, this.headerFormat)
  }

  _calcWeekStart(date) {
    return dateFnsStartOfWeek(date)
  }

  _calcWeekEnd(date) {
    return dateFnsEndOfWeek(date)
  }

  _calcMonthStart(date) {
    return dateFnsStartOfMonth(date)
  }

  _calcMonthEnd(date) {
    return dateFnsEndOfMonth(date)
  }

  _buildStateForMonth = () => {
    this._startOfMonth   = this._calcMonthStart(this._currentMonth),
    this._endOfMonth     = this._calcMonthEnd(this._startOfMonth),
    this._startDate      = this._calcWeekStart(this._currentMonth),
    this._bodyStartDate  = this._calcWeekStart(this._startOfMonth),
    this._bodyEndDate    = this._calcWeekEnd(this._endOfMonth),
    this._formattedMonth = this._calcHeaderText(this._currentMonth)
  }

  _buildWeekdays = () =>
    this._weekdays = weekdays.map((day) => html`
      <li>
        <abbr title="${dateFnsFormat(day, 'EEEEEE')}">
          ${dateFnsFormat(day, this.labelFormat)}
        </abbr>
      </li>
    `)

  _changeMonth = (count = 1) => {
    this._currentMonth = dateFnsAddMonths(this._currentMonth, count)

    this._buildStateForMonth()
  }

  _nextMonth = () => this._changeMonth(1)

  _previousMonth = () => this._changeMonth(-1)

  _onDateClick = (ev) => {
    ev.stopPropagation()
    this.selectedDate = (ev.detail || {}).date || new Date
  }
}

registerElement('calendar-element', CalendarElement)
