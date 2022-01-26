import 'nexinterface/app-bar/app-bar.js';
import { appBarStore } from 'nexinterface/app-bar/app-bar.js';
import { AppScaffold } from 'nexinterface/app-scaffold/app-scaffold.js';
import 'nexinterface/button/button.js';
import 'nexinterface/dialog/dialog.js';
import 'nexinterface/drawer/drawer.js';
import 'nexinterface/menu/menu.js';
import 'nexinterface/router/route.js';
import 'nexinterface/router/router.js';
import 'nexinterface/snackbar/snackbar.js';
import { WithPendingTaskHandler } from 'nexwidget/mixins/pending-task.js';
import { css, html, WidgetTemplate } from 'nexwidget/nexwidget.js';
import './courses.js';

declare global {
  interface HTMLElementTagNameMap {
    'app-widget': AppWidget;
  }
}

export class AppWidget extends WithPendingTaskHandler(AppScaffold) {
  static {
    this.registerAs('app-widget');
  }

  static override get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          grid-template-rows: 1fr max-content 0px 0px 0px 0px;
          --primaryColor: #29b6f6;
        }
      `,
    ];
  }

  override get template(): WidgetTemplate {
    return html`
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
      <app-bar-widget
        variant="bottom"
        ?loading=${this.hasPendingTask}
        app-name="اپ انتخاب واحد"
      ></app-bar-widget>
      <drawer-widget
        variant="bottom"
        headline="اپ انتخاب واحد"
        text="نسخه 2.2.0"
      >
        <button-widget
          link="/add-course"
          variant="menu"
          icon="post_add"
          text="افزودن درس"
        ></button-widget>
      </drawer-widget>
      <menu-widget></menu-widget>
      <dialog-widget></dialog-widget>
      <snackbar-widget></snackbar-widget>
    `;
  }

  override addedCallback() {
    super.addedCallback();
    appBarStore.setOptions({ active: false });
  }
}
