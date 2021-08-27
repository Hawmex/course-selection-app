import { AppScaffold } from 'nexinterface/dist/app-scaffold/app-scaffold.js';
import 'nexinterface/dist/button/button.js';
import 'nexinterface/dist/dialog/dialog.js';
import 'nexinterface/dist/drawer/drawer.js';
import 'nexinterface/dist/router/route.js';
import 'nexinterface/dist/router/router.js';
import 'nexinterface/dist/snackbar/snackbar.js';
import 'nexinterface/dist/top-bar/top-bar.js';
import { setTopBarOptions } from 'nexinterface/dist/top-bar/top-bar.js';
import { css, html, WidgetTemplate } from 'nexwidget';
import { WithPendingTaskHandler } from 'nexwidget/dist/mixins/pending-task.js';
import './courses.js';

declare global {
  interface HTMLElementTagNameMap {
    'app-widget': AppWidget;
  }
}

export class AppWidget extends WithPendingTaskHandler(AppScaffold) {
  static override get styles(): CSSStyleSheet[] {
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

  override addedCallback() {
    super.addedCallback();
    setTopBarOptions({ active: false });
  }

  override get template(): WidgetTemplate {
    return html`
      <top-bar-widget ?loading=${this.hasPendingTask} app-name="اپ انتخاب واحد"></top-bar-widget>
      <drawer-widget headline="اپ انتخاب واحد" text="نسخه 1.2.0">
        <button-widget
          link="/add-course"
          variant="menu"
          icon="post_add"
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
