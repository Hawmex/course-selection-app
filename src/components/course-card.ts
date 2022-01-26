import { Nexinterface } from 'nexinterface/base/base.js';
import 'nexinterface/button/button.js';
import { dialogStore } from 'nexinterface/dialog/dialog.js';
import { menuStore } from 'nexinterface/menu/menu.js';
import 'nexinterface/paper/paper.js';
import 'nexinterface/section/section.js';
import { snackbarStore } from 'nexinterface/snackbar/snackbar.js';
import 'nexinterface/typography/typography.js';
import { css, html, nothing, WidgetTemplate } from 'nexwidget/nexwidget.js';
import { Course, coursesStore } from '../courses.js';

declare global {
  interface HTMLElementTagNameMap {
    'course-card-component': CourseCardComponent;
  }
}

export interface CourseCardComponent {
  get courseName(): string | null;
  set courseName(v: string | null);
}

export class CourseCardComponent extends Nexinterface {
  static {
    this.createAttributes([{ key: 'courseName', type: 'string' }]);
    this.createReactives(['courseName']);
    this.registerAs('course-card-component');
  }

  static override get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host section-widget[variant='buttons'] typography-widget {
          padding: 0px 8px;
        }

        :host section-widget[variant='paragraphs'] {
          padding-top: 0px;
        }

        :host typography-widget[variant='headline'] {
          display: inherit;
        }
      `,
    ];
  }

  #course?: Course;

  override get template(): WidgetTemplate {
    return html`
      <paper-widget>
        <section-widget variant="buttons">
          <typography-widget slot="leading" variant="app-bar">
            ${this.#course?.name}
          </typography-widget>
          <button-widget
            @click=${() =>
              menuStore.setBody(html`
                <button-widget
                  variant="menu"
                  text="حذف درس"
                  icon="delete"
                  @click=${() =>
                    dialogStore.pushQueue({
                      headline: 'هشدار',
                      body: html`
                        <section-widget variant="paragraphs">
                          <typography-widget variant="text">
                            آیا میخواهید درس ${this.#course?.name} را حذف کنید؟
                          </typography-widget>
                        </section-widget>
                      `,
                      button: {
                        text: 'حذف درس',
                        action: () => {
                          coursesStore.deleteCourse(this.#course!);
                          snackbarStore.pushQueue({
                            text: `درس ${this.#course?.name} حذف شد.`,
                          });
                        },
                      },
                    })}
                ></button-widget>
              `)}
            slot="trailing"
            variant="text"
            icon="more_vert"
          ></button-widget>
        </section-widget>
        <section-widget variant="paragraphs">
          <typography-widget variant="text">
            نام استاد:
            <typography-widget variant="headline">
              ${this.#course?.professor ?? '-'}
            </typography-widget>
          </typography-widget>
          <typography-widget variant="text">
            گروه:
            <typography-widget variant="headline">
              ${this.#course?.group ?? '-'}
            </typography-widget>
          </typography-widget>
          <typography-widget variant="text">
            تاریخ امتحان:
            <typography-widget variant="headline">
              ${this.#course?.exam?.date ?? '-'}
            </typography-widget>
          </typography-widget>
          <typography-widget variant="text">
            ساعت امتحان:
            <typography-widget variant="headline">
              ${this.#course?.exam?.time
                ? `${this.#course.exam.time.from}-${this.#course.exam.time.to}`
                : '-'}
            </typography-widget>
          </typography-widget>
          <typography-widget variant="text">
            روزهای جلسات:
            <typography-widget variant="headline">
              ${this.#course?.sessions.days.join(', ')}
            </typography-widget>
          </typography-widget>
          <typography-widget variant="text">
            ساعت جلسات:
            <typography-widget variant="headline">
              ${this.#course?.sessions.time.from}-${this.#course?.sessions.time
                .to}
            </typography-widget>
          </typography-widget>
          ${this.#course?.ta
            ? html`
                <typography-widget variant="text">
                  نام تدریس‌یار:
                  <typography-widget variant="headline">
                    ${this.#course?.ta.name ?? '-'}
                  </typography-widget>
                </typography-widget>
                <typography-widget variant="text">
                  گروه تدریس‌یار:
                  <typography-widget variant="headline">
                    ${this.#course?.ta.group ?? '-'}
                  </typography-widget>
                </typography-widget>
                <typography-widget variant="text">
                  روزهای جلسات تدریس‌یار:
                  <typography-widget variant="headline">
                    ${this.#course?.ta.sessions.days.join(', ')}
                  </typography-widget>
                </typography-widget>
                <typography-widget variant="text">
                  ساعت جلسات تدریس‌یار:
                  <typography-widget variant="headline">
                    ${this.#course?.ta.sessions.time.from} -
                    ${this.#course?.ta.sessions.time.to}
                  </typography-widget>
                </typography-widget>
              `
            : nothing}
        </section-widget>
      </paper-widget>
    `;
  }

  override addedCallback() {
    super.addedCallback();
    this.#course = [...coursesStore.courses].find(
      ({ name }) => name === this.courseName,
    );
  }

  override updatedCallback() {
    super.updatedCallback();
    this.#course = [...coursesStore.courses].find(
      ({ name }) => name === this.courseName,
    );
  }
}
