import { Nexinterface } from 'nexinterface/dist/base/base';
import 'nexinterface/dist/paper/paper.js';
import 'nexinterface/dist/button/button';
import { css, html, nothing, WidgetTemplate } from 'nexwidget';
import { Course, courses, deleteCourse } from '../courses.js';
import { addDialog } from 'nexinterface/dist/dialog/dialog';
import { addSnackbar } from 'nexinterface/dist/snackbar/snackbar';

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
  static get styles(): CSSStyleSheet[] {
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
          display: inline-flex;
        }
      `,
    ];
  }

  #course?: Course;

  addedCallback() {
    super.addedCallback();
    this.#course = [...courses.state.values()].find(
      ({ courseName }) => courseName === this.courseName,
    );
  }

  updatedCallback() {
    super.updatedCallback();
    this.#course = [...courses.state.values()].find(
      ({ courseName }) => courseName === this.courseName,
    );
  }

  get template(): WidgetTemplate {
    return html`
      <paper-widget>
        <section-widget variant="buttons">
          <typography-widget slot="leading" variant="top-bar">
            ${this.#course?.courseName}
          </typography-widget>
          <button-widget
            @click=${() =>
              addDialog({
                headline: 'هشدار',
                body: html`
                  <section-widget variant="paragraphs">
                    <typography-widget variant="text">
                      آیا میخواهید درس ${this.#course?.courseName} را حذف کنید؟
                    </typography-widget>
                  </section-widget>
                `,
                button: {
                  text: 'حذف',
                  action: () => {
                    deleteCourse(this.#course!);
                    addSnackbar({ text: `درس ${this.#course?.courseName} حذف شد.` });
                  },
                },
              })}
            slot="trailing"
            variant="text"
            icon="delete"
          ></button-widget>
        </section-widget>
        <section-widget variant="paragraphs">
          <typography-widget variant="text">
            نام استاد:
            <typography-widget variant="headline">
              ${this.#course?.professorName ?? '-'}
            </typography-widget>
          </typography-widget>
          <typography-widget variant="text">
            گروه:
            <typography-widget variant="headline">
              ${this.#course?.professorName ?? '-'}
            </typography-widget>
          </typography-widget>
          <typography-widget variant="text">
            تاریخ امتحان:
            <typography-widget variant="headline">
              ${this.#course?.examDate ?? '-'}
            </typography-widget>
          </typography-widget>
          <typography-widget variant="text">
            ساعت امتحان:
            <typography-widget variant="headline">
              ${this.#course?.examTime
                ? `${this.#course.examTime.from}-${this.#course.examTime.to}`
                : '-'}
            </typography-widget>
          </typography-widget>
          <typography-widget variant="text">
            روزهای جلسات:
            <typography-widget variant="headline">
              ${this.#course?.sessionDays.join(', ')}
            </typography-widget>
          </typography-widget>
          <typography-widget variant="text">
            ساعت جلسات:
            <typography-widget variant="headline">
              ${this.#course?.sessionTime.from}-${this.#course?.sessionTime.to}
            </typography-widget>
          </typography-widget>
          ${this.#course?.teachingAssistant
            ? html`
                <typography-widget variant="text">
                  نام تدریس‌یار:
                  <typography-widget variant="headline">
                    ${this.#course?.teachingAssistant.assistantName}
                  </typography-widget>
                </typography-widget>
                <typography-widget variant="text">
                  گروه تدریس‌یار:
                  <typography-widget variant="headline">
                    ${this.#course?.teachingAssistant.groupNumber}
                  </typography-widget>
                </typography-widget>
                <typography-widget variant="text">
                  روزهای جلسات تدریس‌یار:
                  <typography-widget variant="headline">
                    ${this.#course?.teachingAssistant.sessionDays.join(', ')}
                  </typography-widget>
                </typography-widget>
                <typography-widget variant="text">
                  ساعت جلسات تدریس‌یار:
                  <typography-widget variant="headline">
                    ${this.#course?.teachingAssistant.sessionTime.from}-${this.#course
                      ?.teachingAssistant.sessionTime.to}
                  </typography-widget>
                </typography-widget>
              `
            : nothing}
        </section-widget>
      </paper-widget>
    `;
  }
}

CourseCardComponent.createAttributes([{ key: 'courseName', type: 'string' }]);
CourseCardComponent.createReactives(['courseName']);
CourseCardComponent.registerAs('course-card-component');
