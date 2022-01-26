import { appBarStore } from 'nexinterface/app-bar/app-bar.js';
import { Nexscreen } from 'nexinterface/screen/screen.js';
import 'nexinterface/typography/typography.js';
import { html, WidgetTemplate } from 'nexwidget/nexwidget.js';

declare global {
  interface HTMLElementTagNameMap {
    'not-found-screen': NotFoundScreen;
  }
}

export class NotFoundScreen extends Nexscreen {
  static {
    this.registerAs('not-found-screen');
  }

  override get template(): WidgetTemplate {
    return html`
      <typography-widget style="text-align: center;" variant="text">
        صفحه‌ای که به دنبال آن می‌گشتید یافت نشد.
      </typography-widget>
    `;
  }

  override addedCallback() {
    super.addedCallback();
    appBarStore.setOptions({ headline: 'یافت نشد' });
  }
}
