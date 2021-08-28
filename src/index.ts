import { Nexinterface } from 'nexinterface/dist/base/base.js';
import { html, WidgetTemplate } from 'nexwidget';
import './app.js';

declare global {
  interface HTMLElementTagNameMap {
    'app-provider': AppProvider;
  }
}

export class AppProvider extends Nexinterface {
  static {
    this.registerAs('app-provider');
  }

  override get template(): WidgetTemplate {
    return html`<app-widget dir="rtl"></app-widget>`;
  }
}
