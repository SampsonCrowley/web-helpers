import {
  create,
  expect,
  fixture,
} from '../calendar-element-body-helper';

describe('CalendarElementBody (<calendar-element-body></calendar-element-body>)', function() {
  describe('Attributes', function() {
    describe('.selectedDate', function() {
      const err = console.error
      let loggedError = null

      before(async () => {
        console.error = (e) => loggedError = e
      })

      after(async () => {
        console.error = err
      })

      it('is undefined by default', async function() {
        const el = await fixture('<calendar-element-body></calendar-element-body>');
        expect(el.selectedDate).to.be.undefined
      });

      it('is unvalidated', async function() {
        const el = await fixture('<calendar-element-body></calendar-element-body>');
        el.selectedDate = 'YYYY'
        expect(el.selectedDate).to.eq('YYYY')
        expect(loggedError).to.be.null
      });
    })
  });
});
