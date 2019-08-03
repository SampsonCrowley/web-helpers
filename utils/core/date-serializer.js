import {
  lightFormat,
} from 'date-fns'

import parse, { validDate } from './parse-date'

const DateSerializer  = {
  fromAttribute(value) {
    try {
      if(!value || value === 'null') return null

      value = parse(value)
    } catch(err) {
      console.error(err)
      value = null
    }
    return validDate(value) ? value : null
  },
  toAttribute(value) {
    return validDate(value) ? lightFormat(value, 'yyyy-MM-dd') : null
  }
}

export default DateSerializer
