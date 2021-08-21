import { Nexinterface } from 'nexinterface/dist/base/base.js';
import { css, html, WidgetTemplate } from 'nexwidget';

declare global {
  interface HTMLElementTagNameMap {
    'chips-container-widget': ChipsContainerWidget;
  }
}

export class ChipsContainerWidget extends Nexinterface {
  static get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          display: flex;
          width: 100%;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 8px;
          padding: 8px;
        }
      `,
    ];
  }

  get template(): WidgetTemplate {
    return html`<slot></slot>`;
  }
}

ChipsContainerWidget.registerAs('chips-container-widget');
