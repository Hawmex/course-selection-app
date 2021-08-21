import { Screen } from 'nexinterface/dist/screen/screen.js';
import { html, WidgetTemplate } from 'nexwidget';

declare global {
  interface HTMLElementTagNameMap {
    'not-found-screen': NotFoundScreen;
  }
}

export class NotFoundScreen extends Screen {
  get template(): WidgetTemplate {
    return html`Not Found`;
  }
}

NotFoundScreen.registerAs('not-found-screen');
