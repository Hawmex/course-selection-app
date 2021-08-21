import { repeat } from 'lit-html/directives/repeat';
import 'nexinterface/dist/button/button.js';
import { activateDrawer } from 'nexinterface/dist/drawer/drawer.js';
import { Screen } from 'nexinterface/dist/screen/screen.js';
import { setTopBarOptions } from 'nexinterface/dist/top-bar/top-bar.js';
import { html, WidgetTemplate } from 'nexwidget';
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
          icon="add"
          @click=${() => history.pushState({}, document.title, '/add-course')}
        ></button-widget>
      `,
    });

    courses.runAndSubscribe((courses) => (this.courses = [...courses]));
  }

  get template(): WidgetTemplate {
    return repeat(
      this.courses!,
      ({ courseName }) => courseName,
      ({ courseName }) =>
        html`<course-card-component course-name=${courseName}></course-card-component>`,
    );
  }
}

HomeScreen.createReactives(['courses']);
HomeScreen.registerAs('home-screen');
