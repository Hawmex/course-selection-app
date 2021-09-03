import { repeat } from 'lit-html/directives/repeat.js';
import 'nexinterface/button/button.js';
import { activateDrawer } from 'nexinterface/drawer/drawer.js';
import { Nexscreen } from 'nexinterface/screen/screen.js';
import { setTopBarOptions } from 'nexinterface/top-bar/top-bar.js';
import 'nexinterface/typography/typography.js';
import { html, WidgetAnimation, WidgetTemplate } from 'nexwidget/nexwidget.js';
import '../components/course-card.js';
import { Course, courses } from '../courses.js';

declare global {
  interface HTMLElementTagNameMap {
    'home-screen': HomeScreen;
  }
}

export interface HomeScreen {
  get courses(): Course[] | undefined;
  set courses(v: Course[] | undefined);
}

export class HomeScreen extends Nexscreen {
  static {
    this.createReactives(['courses']);
    this.registerAs('home-screen');
  }

  override get template(): WidgetTemplate {
    return this.courses!.length
      ? repeat(
          this.courses!,
          ({ courseName }) => courseName,
          ({ courseName }) =>
            html`<course-card-component course-name=${courseName}></course-card-component>`,
        )
      : html`
          <typography-widget style="text-align: center;" variant="text">
            درسی ندارید. اضافه کنید!
          </typography-widget>
        `;
  }

  override get updateOrSlotChangeAnimation(): WidgetAnimation {
    return this.mountAnimation;
  }

  override addedCallback() {
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
}
