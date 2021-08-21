import { Screen } from 'nexinterface/dist/screen/screen.js';
import { html, WidgetTemplate } from 'nexwidget';

declare global {
  interface HTMLElementTagNameMap {
    'home-screen': HomeScreen;
  }
}

export class HomeScreen extends Screen {
  get template(): WidgetTemplate {
    return html`Home`;
  }
}

HomeScreen.registerAs('home-screen');
