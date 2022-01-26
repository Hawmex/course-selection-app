import { repeat } from 'lit-html/directives/repeat.js';
import { appBarStore } from 'nexinterface/app-bar/app-bar.js';
import 'nexinterface/button/button.js';
import { drawerStore } from 'nexinterface/drawer/drawer.js';
import { Nexscreen } from 'nexinterface/screen/screen.js';
import 'nexinterface/typography/typography.js';
import { html, WidgetAnimation, WidgetTemplate } from 'nexwidget/nexwidget.js';
import '../components/course-card.js';
import { Course, coursesStore } from '../courses.js';

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
    return this.courses!.length ? <WidgetTemplate>repeat(
          this.courses!,
          ({ name }) => name,
          ({ name }) =>
            html`<course-card-component
              course-name=${name}
            ></course-card-component>`,
        ) : html` <typography-widget style="text-align: center;" variant="text"> درسی
            ندارید. اضافه کنید! </typography-widget> `;
  }

  override get updateOrSlotChangeAnimation(): WidgetAnimation {
    return this.mountAnimation;
  }

  override addedCallback() {
    super.addedCallback();
    appBarStore.setOptions({
      headline: 'خانه',
      leading: { icon: 'menu', action: () => drawerStore.activate() },
      trailing: html`
        <button-widget
          variant="text"
          icon="post_add"
          @click=${() => history.pushState({}, document.title, '/add-course')}
        ></button-widget>
      `,
    });

    coursesStore.runAndSubscribe(
      () => (this.courses = [...coursesStore.courses]),
    );
  }
}
