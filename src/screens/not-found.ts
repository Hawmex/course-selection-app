import { Screen } from 'nexinterface/dist/screen/screen.js';
import { setTopBarOptions } from 'nexinterface/dist/top-bar/top-bar.js';
import 'nexinterface/dist/typography/typography.js';
import { html, WidgetTemplate } from 'nexwidget';

declare global {
  interface HTMLElementTagNameMap {
    'not-found-screen': NotFoundScreen;
  }
}

export class NotFoundScreen extends Screen {
  override addedCallback() {
    super.addedCallback();
    setTopBarOptions({ headline: 'یافت نشد' });
  }

  override get template(): WidgetTemplate {
    return html`
      <typography-widget style="justify-self: center;" variant="text">
        صفحه‌ای که به دنبال آن می‌گشتید یافت نشد.
      </typography-widget>
    `;
  }
}

NotFoundScreen.registerAs('not-found-screen');
