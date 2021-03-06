import { html, css, unsafeCSS } from 'lit-element';
import BasePage from './base'

import { DisplayStyles, GridStyles, SharedStyles } from '@web-helpers/styles';

export class BannerPage extends BasePage {
  static get styles() {
    return [
      SharedStyles,
      DisplayStyles,
      GridStyles,
      css`
        .banner {
          position: relative;
          background-color: rgba(0, 63, 105, 0.5);
          background-size: cover;
          background-position: center;
          background-blend-mode: color;
          color: #FFFFFF;
          height: calc(100vh - 64px);
          font-family: 'Source Sans Pro', sans-serif;
          font-size: 5vmin;
        }
        .banner * {
          margin: 0;
        }
        .banner h1,
        .banner ::slotted(h1) {
          line-height: 1;
          font-size: 10vmin;
          text-transform: uppercase;
        }
        .banner .banner-top {
          display: var(--banner-page-top-display)
          font-size: var(--banner-page-font-size)
          font-size: var(--banner-page-font-size)
        }
        .banner .scroll-helper {
          position: absolute;
          bottom: 0;
          right: 0;
          padding: 2.5vmin;
          background: rgba(34, 34, 34, 0.5);
          font-size: 2.5vmin;
        }
        img.rounded {
          position: relative;
          width: 100%;
          height: 100%;
          border: .2rem solid rgba(2,117,216,.6);
        }
        @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
          .banner::after {
            content: '';
            background: rgba(34, 34, 34, 0.5);
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 100%;
          }
          .banner * {
            z-index: 1;
          }
        }

        @supports (-ms-ime-align: auto) {
          .banner:after {
            content: '';
            background: rgba(34, 34, 34, 0.5);
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 100%;
          }
          .banner * {
            z-index: 1;
          }
        }
        @media(min-width: 768px) {
          .banner {
            height: calc(100vh - 107px);
          }
        }
        /* .banner:hover {
          background-color: unset;
          color: transparent;
          min-height: 50vh;
        } */
      `,
    ];
  }

  render() {
    return html`
      <section class="banner d-vertical d-center-center">
        <slot name="banner">
          <h1>Big Text</h1>
          <p>Smaller Text</p>
          <h1>Big Text Again</h1>
        </slot>
        <div class="scroll-helper">
          <slot name="scroll-text">
            Scroll For More Info!
          </slot>
        </div>
      </section>
      <slot name="content">
        <section class="container">
          <slot>
            <p>
              Vestibulum at est ex. Aenean id ligula id nibh dictum laoreet. Etiam non semper erat. Pellentesque eu justo rhoncus diam vulputate facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam feugiat metus ex, vel fringilla massa tincidunt sit amet. Nunc facilisis bibendum tristique. Mauris commodo, dolor vitae dapibus fermentum, odio nibh viverra lorem, eu cursus diam turpis et sapien. Nunc suscipit tortor a ligula tincidunt, id hendrerit tellus sollicitudin.
            </p>
          </slot>
        </section>
      </slot>

    `;
  }
}

window.customElements.define('easy-layout-page-banner', BannerPage);
