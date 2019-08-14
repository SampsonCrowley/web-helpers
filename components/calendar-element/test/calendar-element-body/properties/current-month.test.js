import {
  create,
  expect,
  fixture,
} from '../calendar-element-body-helper';

describe('CalendarElementBody (<calendar-element-body></calendar-element-body>)', function() {
  describe('Properties', function() {
    describe('.currentMonth', function() {
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
        expect(el.currentMonth).to.be.undefined
      });

      it('is unvalidated', async function() {
        const el = await fixture('<calendar-element-body></calendar-element-body>');
        el.currentMonth = 'YYYY'
        expect(el.currentMonth).to.eq('YYYY')
        expect(loggedError).to.be.null
      });
    })
  });
});
