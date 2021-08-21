import 'nexinterface/dist/button/button.js';
import { Screen } from 'nexinterface/dist/screen/screen.js';
import { setTopBarOptions } from 'nexinterface/dist/top-bar/top-bar';
import { html, WidgetTemplate } from 'nexwidget';

declare global {
  interface HTMLElementTagNameMap {
    'add-course-screen': AddCourseScreen;
  }
}

export class AddCourseScreen extends Screen {
  addedCallback() {
    super.addedCallback();
    setTopBarOptions({
      headline: 'افزودن درس',
      trailing: html`<button-widget variant="text" icon="done"></button-widget>`,
    });
  }

  get template(): WidgetTemplate {
    return html`Add Course`;
  }
}

AddCourseScreen.registerAs('add-course-screen');
