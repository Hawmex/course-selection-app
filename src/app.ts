import { AppScaffold } from 'nexinterface/dist/app-scaffold/app-scaffold.js';
import 'nexinterface/dist/button/button.js';
import 'nexinterface/dist/dialog/dialog.js';
import 'nexinterface/dist/drawer/drawer.js';
import 'nexinterface/dist/router/router.js';
import 'nexinterface/dist/snackbar/snackbar.js';
import 'nexinterface/dist/top-bar/top-bar.js';
import { css, html, WidgetTemplate } from 'nexwidget';
import './courses.js';

declare global {
  interface HTMLElementTagNameMap {
    'app-widget': AppWidget;
  }
}

export class AppWidget extends AppScaffold {
  static get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          grid-template-rows: max-content 0px 1fr 0px 0px;
          --primaryColor: #26a69a;
          --errorColor: #ef5350;
        }
      `,
    ];
  }

  get template(): WidgetTemplate {
    return html`
      <top-bar-widget app-name="اپ انتخاب واحد"></top-bar-widget>
      <drawer-widget headline="اپ انتخاب واحد" text="نسخه 0.1.0">
        <button-widget
          link="/add-course"
          variant="menu"
          icon="add"
          text="افزودن درس"
        ></button-widget>
      </drawer-widget>
      <router-widget>
        <route-widget
          path="/"
          component="home-screen"
          .src=${() => import('./screens/home.js')}
        ></route-widget>
        <route-widget
          path="/add-course"
          component="add-course-screen"
          .src=${() => import('./screens/add-course.js')}
        ></route-widget>
      </router-widget>
      <dialog-widget></dialog-widget>
      <snackbar-widget></snackbar-widget>
    `;
  }
}

AppWidget.registerAs('app-widget');
