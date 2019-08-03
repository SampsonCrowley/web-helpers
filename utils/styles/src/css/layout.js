import {css} from 'lit-element';
export default css`:host{display:block}*{box-sizing:border-box}app-header{z-index:10}app-drawer{z-index:20}.toolbar-top{background-color:var(--app-header-background-color,#fff)}[main-title]{font-family:Helvetica,Arial,sans-serif;font-size:30px;padding-right:44px}.toolbar-list{line-height:0;display:none}.toolbar-list>a{display:inline-block;color:var(--app-header-text-color,#444);text-decoration:none;line-height:30px;padding:4px 24px;font-size:1.2rem}.toolbar-list>a[selected]{color:var(--app-header-selected-color,#e91e63);border-bottom:4px solid var(--app-header-selected-color,#e91e63)}.menu-btn{background:0 0;border:none;fill:var(--app-header-text-color,#444);cursor:pointer;height:44px;width:44px}.drawer-list{box-sizing:border-box;width:100%;height:100%;padding:24px;background:var(--app-drawer-background-color,#444);position:relative}.drawer-list>a{display:block;text-decoration:none;color:var(--app-drawer-text-color,#fff);line-height:40px;padding:0 24px}.drawer-list>a[selected]{color:var(--app-drawer-selected-color,#78909c)}main{display:block}.main-content{padding-top:64px;min-height:100vh}.page{display:none}.page[active]{display:block}footer{padding:24px;background:var(--app-drawer-background-color,#444);color:var(--app-drawer-text-color,#fff);text-align:center}@media (max-width:400px){[main-title]{font-size:20px}}@media (max-width:300px){[main-title]{font-size:14px}}@media (min-width:768px) and (min-height:640px){.toolbar-list{display:block}.menu-btn{display:none}.main-content{padding-top:107px}[main-title]{padding-right:0;border-bottom:1px solid #f7f7f7;border-image:linear-gradient(100deg,#fff 0,var(--app-primary-color-transparent) 50%,#fff 100%) 1 0}}`;