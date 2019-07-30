import dateFns from 'date-fns'

const DateSerializer  = {
  fromAttribute(value) {
    try {
      if(!value || value === 'null') return null

      value = dateFns.parse(value)
    } catch(err) {
      console.error(err)
      value = new Date()
    }
    return value
  },
  toAttribute(value) {
    return value ? dateFns.format(value, 'YYYY-MM-DD') : null
  }
}

export default DateSerializer
