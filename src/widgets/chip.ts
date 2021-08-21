import 'nexinterface/dist/icon/icon.js';
import { Interactive } from 'nexinterface/dist/interactive/interactive.js';
import 'nexinterface/dist/typography/typography.js';
import { css, html, nothing, WidgetTemplate } from 'nexwidget';

declare global {
  interface HTMLElementTagNameMap {
    'chip-widget': ChipWidget;
  }
}

export interface ChipWidget {
  get icon(): string | null;
  set icon(v: string | null);

  get text(): string | null;
  set text(v: string | null);
}

export class ChipWidget extends Interactive {
  static get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          display: flex;
          width: max-content;
          background: var(--backgroundColor);
          min-height: 32px;
          align-items: center;
          border-radius: 10000px;
          box-shadow: var(--shadowLvl1);
        }

        :host icon-widget {
          padding: 4px;
        }

        :host typography-widget {
          padding: 4px 12px;
        }

        :host([icon]) typography-widget {
          padding: 4px 4px 4px 12px;
        }
      `,
    ];
  }

  get template(): WidgetTemplate {
    return html`
      ${this.icon ? html`<icon-widget value=${this.icon}></icon-widget>` : nothing}
      <typography-widget variant="text"> ${this.text} </typography-widget>
    `;
  }
}

ChipWidget.createAttributes([
  { key: 'icon', type: 'string' },
  { key: 'text', type: 'string' },
]);

ChipWidget.createReactives(['icon', 'text']);
ChipWidget.registerAs('chip-widget');
