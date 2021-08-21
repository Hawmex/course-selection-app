import { AppScaffold } from 'nexinterface/dist/app-scaffold/app-scaffold.js';
import 'nexinterface/dist/dialog/dialog.js';
import 'nexinterface/dist/drawer/drawer.js';
import 'nexinterface/dist/router/router.js';
import 'nexinterface/dist/snackbar/snackbar.js';
import 'nexinterface/dist/top-bar/top-bar.js';
import { html, WidgetTemplate } from 'nexwidget';

declare global {
  interface HTMLElementTagNameMap {
    'app-widget': AppWidget;
  }
}

export class AppWidget extends AppScaffold {
  get template(): WidgetTemplate {
    return html`
      <top-bar-widget app-name="اپ انتخاب واحد"></top-bar-widget>

      <drawer-widget headline="اپ انتخاب واحد" text="نسخه 0.1.0"></drawer-widget>

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

        <route-widget
          path="*"
          component="not-found-screen"
          .src=${() => import('./screens/not-found.js')}
        ></route-widget>
      </router-widget>

      <dialog-widget></dialog-widget>

      <snackbar-widget></snackbar-widget>
    `;
  }
}

AppWidget.registerAs('app-widget');
