import { css, unsafeCSS } from 'lit-element';
import { ButtonStyles } from './button-styles'
import sharedStylus from './css/shared'

export const SharedStyles = css`
  ${ sharedStylus }

  ${ ButtonStyles }

  :host {
    display: block;
    box-sizing: border-box;
  }

  section {
    background: var(--app-section-odd-color, #FFFFFF);
    padding:1rem;
  }

  section:nth-of-type(even) {
    background: var(--app-section-even-color, #EFEFEF);
  }

  h2 {
    font-size: 24px;
    text-align: center;
    /* color: var(--app-dark-text-color, #444444); */
  }

  @media (min-width: 460px) {
    h2 {
      font-size: 36px;
    }
  }

  .circle {
    display: block;
    width: 64px;
    height: 64px;
    margin: 0 auto;
    text-align: center;
    border-radius: 50%;
    background: var(--app-primary-color, rgb(233, 30, 99));
    color: var(--app-light-text-color, #FFF);
    font-size: 30px;
    line-height: 64px;
  }
`;
