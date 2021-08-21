import { Screen } from 'nexinterface/dist/screen/screen.js';
import { html, WidgetTemplate } from 'nexwidget';

declare global {
  interface HTMLElementTagNameMap {
    'add-course-screen': AddCourseScreen;
  }
}

export class AddCourseScreen extends Screen {
  get template(): WidgetTemplate {
    return html`Add Course`;
  }
}

AddCourseScreen.registerAs('add-course-screen');
