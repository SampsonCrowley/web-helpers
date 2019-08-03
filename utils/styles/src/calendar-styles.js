import { css } from 'lit-element';

const cellFontSize    = css`calc(16px + (21 - 16) * ((100vw - 300px) / (1600 - 300)))`,
      headerFontSize  = css`calc(24px + (48 - 24) * ((100vw - 300px) / (1600 - 300)))`,
      weekdayFontSize = css`calc(16px + (26 - 16) * ((100vw - 300px) / (1600 - 300)))`;

export const CalendarStyles = css`
  .material-icons {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -webkit-font-feature-settings: 'liga';
    -webkit-font-smoothing: antialiased;
  }

  header {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    font-size: var(--calendar-header-full-font-size, var(--calendar-header-font-size, ${headerFontSize}));
    justify-content: space-between;
    margin-bottom: 1rem;
    background: #000;
    color: #fff;
    text-align: center;
  }

  header .calendar-nav {
    padding: 0 1em;
    width: 30%;
    text-align: left;
    display: flex;
    justify-content: start;
    align-items: center;
  }

  header .calendar-nav:nth-child(3) {
    justify-content: flex-end;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
    max-width: 64em;
    padding: 0;
    margin-bottom: 1em;
  }

  li {
    display: flex;
    align-items: center;
    justify-content: center;
    list-style: none;
    margin: 0;
    margin-left: var(--calendar-grid-gap-left, var(--calendar-grid-gap, 0));
    margin-bottom: var(--calendar-grid-gap-bottom, var(--calendar-grid-gap, 0));
    font-size: var(--calendar-cell-full-font-size, var(--calendar-cell-font-size, ${cellFontSize}));
    width: var(--calendar-cell-width, 14.2857%);
  }

  ul.day-grid {
    height: var(--calendar-day-grid-height);
  }

  ul.weekdays {
    height: var(--calendar-weekdays-height);
    margin-bottom: 1em;
  }

  ul.weekdays li {
    height: var(--calendar-label-cell-height, 4vw);
  }

  ul.day-grid li {
    box-shadow:0 0 0 1px #eaeaea;

    background-color: #ffffff;
    height: var(--calendar-cell-height, 12vw);
    max-height: 125px;
  }

  ul.day-grid li.other-month {
    background-color: #eaeaea;
  }

  ul.day-grid li.selected-date {
    background-color: var(--calendar-selected-background-color, #EFE);
    border-left: var(--calendar-selected-border-size, .75vmin) solid transparent;
    border-image: linear-gradient(45deg, var(--calendar-selected-background-color, #EFE), var(--calendar-selected-background-gradient, #0F0) 40%);
    border-image-slice: 1;
  }

  ul.weekdays > li > abbr[title],
  ul.day-grid > li > abbr[title] {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    border: none;
    text-decoration: none;
  }

  ul.weekdays abbr[title] {
    font-weight: 800;
  }

  @media all and (max-width: 799px) {
    /* ul {
      grid-gap: .25em;
    } */

    ul.weekdays li {
      font-size: 0;
    }

    ul.weekdays > li abbr:after {
      content: attr(title);
      font-size: var(--calendar-cell-base-font-size, var(--calendar-cell-font-size, ${cellFontSize}));
      text-align: center;
    }
  }
`;



// export const CalendarStyles = css`
//   .material-icons {
//     font-family: 'Material Icons';
//     font-weight: normal;
//     font-style: normal;
//     font-size: 24px;
//     line-height: 1;
//     letter-spacing: normal;
//     text-transform: none;
//     display: inline-block;
//     white-space: nowrap;
//     word-wrap: normal;
//     direction: ltr;
//     -webkit-font-feature-settings: 'liga';
//     -webkit-font-smoothing: antialiased;
//   }
//
//   header {
//     display: flex;
//     flex-flow: row nowrap;
//     align-items: center;
//     font-size: ${cellFontSize};
//     justify-content: space-between;
//     margin-bottom: 1rem;
//     background: #000;
//     color: #fff;
//     text-align: center;
//   }
//
//   header .calendar-nav {
//     padding: 0 1em;
//     width: 30%;
//     text-align: left;
//     display: flex;
//     justify-content: start;
//     align-items: center;
//   }
//
//   header .calendar-nav:nth-child(3) {
//     justify-content: flex-end;
//   }
//
//   ul {
//     display: -ms-grid;
//     display: grid;
//     -ms-grid-columns: (1fr 14vw)[3] 1fr;
//     grid-template-columns: repeat(7, 1fr);
//     margin: 0 auto;
//     max-width: 64em;
//     padding: 0;
//     margin-bottom: 1em;
//   }
//
//   li {
//     -ms-grid-column: 1;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     list-style: none;
//     margin-left: 0;
//     font-size: calc(16px + (21 - 16) * ((100vw - 300px) / (1600 - 300)));
//   }
//
//   ul.weekdays {
//     margin-bottom: 1em;
//   }
//
//   ul.weekdays li {
//     height: 4vw;
//   }
//
//   ul.day-grid li {
//     box-shadow:0 0 0 1px #eaeaea;
//
//     background-color: #ffffff;
//     height: 12vw;
//     max-height: 125px;
//   }
//
//   ul.day-grid li.other-month {
//     background-color: #eaeaea;
//   }
//
//   ul.day-grid li.selected-date {
//     background-color: #EFE;
//     border-left: .75vmin solid transparent;
//     border-image: linear-gradient(45deg, #EFE, #0F0 40%);
//     border-image-slice: 1;
//   }
//
//   ul.weekdays abbr[title] {
//     border: none;
//     font-weight: 800;
//     text-decoration: none;
//   }
//
//   @media all and (max-width: 800px) {
//     /* ul {
//       grid-gap: .25em;
//     } */
//
//     ul.weekdays li {
//       font-size: 0;
//     }
//
//     ul.weekdays > li abbr:after {
//       content: attr(title);
//       font-size: ${cellFontSize};
//       text-align: center;
//     }
//   }
// `;
