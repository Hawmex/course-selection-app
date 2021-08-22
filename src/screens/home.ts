import { repeat } from 'lit-html/directives/repeat';
import 'nexinterface/dist/button/button.js';
import { activateDrawer } from 'nexinterface/dist/drawer/drawer.js';
import { Screen } from 'nexinterface/dist/screen/screen.js';
import { setTopBarOptions } from 'nexinterface/dist/top-bar/top-bar.js';
import 'nexinterface/dist/typography/typography.js';
import { html, WidgetAnimation, WidgetTemplate } from 'nexwidget';
import '../components/course-card.js';
import { Course, courses } from '../courses';

declare global {
  interface HTMLElementTagNameMap {
    'home-screen': HomeScreen;
  }
}

export interface HomeScreen {
  get courses(): Course[] | undefined;
  set courses(v: Course[] | undefined);
}

export class HomeScreen extends Screen {
  addedCallback() {
    super.addedCallback();
    setTopBarOptions({
      headline: 'خانه',
      leading: { icon: 'menu', action: activateDrawer },
      trailing: html`
        <button-widget
          variant="text"
          icon="post_add"
          @click=${() => history.pushState({}, document.title, '/add-course')}
        ></button-widget>
      `,
    });

    courses.runAndSubscribe((courses) => (this.courses = [...courses]));
  }

  get template(): WidgetTemplate {
    return this.courses!.length
      ? repeat(
          this.courses!,
          ({ courseName }) => courseName,
          ({ courseName }) =>
            html`<course-card-component course-name=${courseName}></course-card-component>`,
        )
      : html`
          <typography-widget style="justify-self: center;" variant="text">
            درسی ندارید. اضافه کنید!
          </typography-widget>
        `;
  }

  get updateOrSlotChangeAnimation(): WidgetAnimation {
    return this.mountAnimation;
  }
}

HomeScreen.createReactives(['courses']);
HomeScreen.registerAs('home-screen');
