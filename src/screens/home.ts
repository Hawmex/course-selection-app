import 'nexinterface/dist/button/button.js';
import { activateDrawer } from 'nexinterface/dist/drawer/drawer.js';
import { Screen } from 'nexinterface/dist/screen/screen.js';
import { setTopBarOptions } from 'nexinterface/dist/top-bar/top-bar.js';
import { html, WidgetTemplate } from 'nexwidget';

declare global {
  interface HTMLElementTagNameMap {
    'home-screen': HomeScreen;
  }
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
  }

  get template(): WidgetTemplate {
    return html`Home`;
  }
}

HomeScreen.registerAs('home-screen');
