import { LitElement, html, css } from 'lit-element'
import MediaQuery from '@web-helpers/core/media-query'
import ConnectionSpeed from '@web-helpers/core/connection-speed'
import Router from '@web-helpers/core/router'
import Metadata from '@web-helpers/core/metadata'


// These are the elements needed by this element.
import './header';
import './toolbar';
import './drawer'
import { menuIcon } from '@web-helpers/icons';
import '@web-helpers/snack-bar';
import { LayoutStyles, SharedStyles } from '@web-helpers/styles'

export class ClientLayout extends LitElement {
  static get properties() {
    return {
      appTitle: { type: String },
      links: { type: Array },
      _page: { type: String },
      _drawerOpened: { type: Boolean },
      _snackbarOpened: { type: Boolean },
      _offline: { type: Boolean }
    };
  }

  static _attributeNameForProperty(property) {
    return property.replace(/([A-Z]+)/g, '-$1').toLowerCase();
  }

  static get styles() {
    return [
      SharedStyles,
      LayoutStyles
    ];
  }

  render() {
    let active
    console.log(this._page)
    // Anything that's related to rendering should be done in here.
    return html`
      <!-- Header -->
      <easy-layout-client-app-header>
        <easy-layout-client-app-toolbar class="toolbar-top">
          <button class="menu-btn" title="Menu" @click="${this._menuButtonClicked}">${menuIcon}</button>
          <div main-title>${this.appTitle}</div>
        </easy-layout-client-app-toolbar>

        <!-- This gets hidden on a small screen-->
        <slot name="app-toolbar">
          ${this.navBar('toolbar-list')}
        </slot>

      </easy-layout-client-app-header>

      <!-- Drawer content -->
      <easy-layout-client-app-drawer
          .opened="${this._drawerOpened}"
          @opened-changed="${this._drawerOpenedChanged}">
        <slot name="app-drawer">
          ${this.navBar('drawer-list')}
        </slot>
      </easy-layout-client-app-drawer>

      <!-- Main content -->
      <main id="easy-layout-client-main-slot" role="main" class="main-content">
        <slot>
          <easy-layout-page-home class="page" ?active="${this._page === 'home' && (active = true)}"></easy-layout-page-home>
          <easy-layout-page-four-oh-four class="page" ?active="${!active}"></easy-layout-page-four-oh-four>
        </slot>
      </main>

      <footer>
        <slot name="app-footer">
          <p>
            ${this.appTitle}
          </p>
        </slot>
      </footer>

      <snack-bar ?active="${this._snackbarOpened}">
        You are now ${this._offline ? 'offline' : 'online'}.
      </snack-bar>
    `;
  }

  _mediaQuery = '(min-width: 768px) and (min-height: 640px)'

  constructor() {
    super();
    this._drawerOpened = false;
    this.links = [ 'home' ]
  }

  connectedCallback() {
    super.connectedCallback()

    ConnectionSpeed.registerStatus(this._offlineChanged)
    MediaQuery.register(this._mediaQuery, this._layoutChanged)
    Router.register(this._locationChanged)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._mainEl = false

    ConnectionSpeed.unregisterStatus(this._offlineChanged)
    MediaQuery.unregister(this._mediaQuery, this._layoutChanged)
    Router.unregister(this._locationChanged)
  }

  updated(changedProps) {
    if (changedProps.has('_page')) {
      const pageTitle = this.appTitle + ' - ' + this._page;
      Metadata.update({
        title: pageTitle,
        description: pageTitle
        // This object also takes an image property, that points to an img src.
      });
    }
  }

  _onDateChange = (ev) => console.log(ev.detail)

  _layoutChanged = ({ matches }) => {
    // The drawer doesn't make sense in a wide layout, so if it's opened, close it.
    if(matches) this._updateDrawerState(false);
  }

  _offlineChanged = (offline) => {
    if(offline !== this._offline) {
      const previousOffline = this._offline;
      this._offline = offline;

      // Don't show the snackbar on the first load of the page.
      if(previousOffline === undefined) return;

      clearTimeout(this._snackbarTimer);
      this._snackbarOpened = true;
      this._snackbarTimer = setTimeout(() => { this._snackbarOpened = false }, 3000);
    }
  }

  _locationChanged = ({ location }) => {
    const path = window.decodeURIComponent(location.pathname);
    const page = path === '/' ? 'home' : path.slice(1);
    this.loadPage(page);
    this._setNavLinks()
    // Close the drawer - in case the *path* change came from a link in the drawer.
    this._updateDrawerState(false);
  }

  _updateDrawerState(opened) {
    if (opened !== this._drawerOpened) {
      this._drawerOpened = opened;
    }
  }

  navBar(className) {
    return html`
      <nav class="${className}">
        ${ this._navLinks }
      </nav>
    `
  }

  loadPage(page) {
    let found = false;
    switch(page) {
      case 'home':
        import(
          /* webpackChunkName: "page-home" */
          '../pages/home'
        ).then(() => {
          // this._setMain('home')
        })
        break;
      default:
        import(
          /* webpackChunkName: "page-four-oh-four" */
          '../pages/four-oh-four'
        ).then(() => {
          // this._setMain('four-oh-four')
        })
    }

    this._page = page;
  }

  _setMain = (page) => this._mainEl.innerHTML = `<easy-layout-page-${page} class="page" active></easy-layout-page-${page}>`

  _menuButtonClicked() {
    this._updateDrawerState(true);
  }

  _drawerOpenedChanged(e) {
    this._updateDrawerState(e.target.opened);
  }

  _setNavLinks() {
    this._navLinks = this.links.map(link => {
      if(link.type === 'html') return link
      if(typeof link === 'function') return link(this._page)

      const selected = link.match instanceof RegExp
        ? link.match.test(this._page)
        : typeof link.match === 'function'
          ? link.match(link, this._page, this.links)
          : this._page === (link.match || link.value)

      return html`<a ?selected="${selected}" href="/${link.value}">${link.display}</a>`
    })
  }

  get _mainEl() {
    this._mainElement || (this._mainElement = this.shadowRoot.getElementById('easy-layout-client-main-slot'))
    try {
      this._mainElement = this._mainElement || this.shadowRoot.getElementById('easy-layout-client-main-slot')
    } catch(err) {
      this._mainElement = null
    }
    return this._mainElement
  }

  set _mainEl(value) {
    this._mainElement = value
  }

  get links() {
    return this._links || []
  }

  set links(newLinks) {
    const linksWas = this._links,
          links = []
    try {
      for(let link of newLinks) {
        if(link) {
          if(typeof link === 'string') link = { value: link }
          if(typeof link === 'object') {
            if(link.type && link.type === 'html') links.push(link)
            else links.push({
              value: link.value,
              match: link.match || new RegExp(`^${link.value}`),
              display: link.display || link.value.split(' ').map(v => `${v[0].toUpperCase()}${v.slice(1)}`).join(' ')
            })
          }
          else if(typeof link === 'function') links.push(link)
        }
      }

      this._links = links
      this._setNavLinks()
      this.requestUpdate('links', linksWas)
    } catch (err) {
      this.links = [ ...linksWas ]
    }
  }
}

window.customElements.define('easy-layout-client', ClientLayout);
