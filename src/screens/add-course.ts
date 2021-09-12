import { repeat } from 'lit-html/directives/repeat.js';
import { setAppBarOptions } from 'nexinterface/app-bar/app-bar.js';
import 'nexinterface/button/button.js';
import 'nexinterface/chip/chip.js';
import 'nexinterface/chip/chips-container.js';
import { addDialog, removeDialog } from 'nexinterface/dialog/dialog.js';
import 'nexinterface/input/input.js';
import { InputWidget } from 'nexinterface/input/input.js';
import 'nexinterface/paper/paper.js';
import { Nexscreen } from 'nexinterface/screen/screen.js';
import 'nexinterface/section/section.js';
import { addSnackbar } from 'nexinterface/snackbar/snackbar.js';
import 'nexinterface/typography/typography.js';
import { html, nothing, WidgetTemplate } from 'nexwidget/nexwidget.js';
import { addCourse, Course, courses, ExamDate, SessionDay, Time } from '../courses.js';
import { checkIfSessionsInterfere, checkIfTimeIsWrong, checkIfTimesInterfere } from '../utils.js';

declare global {
  interface HTMLElementTagNameMap {
    'add-course-screen': AddCourseScreen;
  }
}

export interface AddCourseScreen {
  get courseSessionDays(): SessionDay[] | undefined;
  set courseSessionDays(v: SessionDay[] | undefined);

  get taSessionDays(): SessionDay[] | undefined;
  set taSessionDays(v: SessionDay[] | undefined);
}

export class AddCourseScreen extends Nexscreen {
  static {
    this.createReactives(['taSessionDays', 'courseSessionDays']);
    this.registerAs('add-course-screen');
  }

  #days = <const>['شنبه', 'یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

  #courseName?: InputWidget;
  #professorName?: InputWidget;
  #sessionStartTime?: InputWidget;
  #sessionEndTime?: InputWidget;
  #examDate?: InputWidget;
  #examStartTime?: InputWidget;
  #examEndTime?: InputWidget;
  #courseGroup?: InputWidget;
  #taName?: InputWidget;
  #taSessionStartTime?: InputWidget;
  #taSessionEndTime?: InputWidget;
  #taGroup?: InputWidget;

  override get template(): WidgetTemplate {
    return html`
      <paper-widget full-width>
        <section-widget variant="inputs">
          <typography-widget variant="headline">درس</typography-widget>
          <input-widget data-key="courseName" variant="text" label="نام درس*"></input-widget>
          <input-widget data-key="professorName" variant="text" label="نام استاد"></input-widget>
          <input-widget
            data-key="courseGroup"
            variant="number"
            label="گروه"
            placeholder="نمونه: 12"
          ></input-widget>
          <input-widget
            data-key="examDate"
            variant="text"
            label="تاریخ امتحان"
            placeholder="نمونه: 10/28"
          ></input-widget>
          <input-widget
            data-key="examStartTime"
            variant="time"
            label="ساعت شروع امتحان"
          ></input-widget>
          <input-widget
            data-key="examEndTime"
            variant="time"
            label="ساعت پایان امتحان"
          ></input-widget>
          <input-widget
            data-key="sessionStartTime"
            variant="time"
            label="ساعت شروع جلسه*"
          ></input-widget>
          <input-widget
            data-key="sessionEndTime"
            variant="time"
            label="ساعت پایان جلسه*"
          ></input-widget>
          ${this.courseSessionDays?.length
            ? html`
                <chips-container-widget>
                  ${repeat(
                    this.courseSessionDays,
                    (day) => day,
                    (day) =>
                      html`
                        <chip-widget
                          icon="cancel"
                          text=${day}
                          @click=${() => this.#deleteCourseSessionDay(day)}
                        ></chip-widget>
                      `,
                  )}
                </chips-container-widget>
              `
            : nothing}
        </section-widget>
        <section-widget variant="buttons">
          <button-widget
            slot="trailing"
            variant="text"
            text="افزودن روز"
            icon="today"
            @click=${() =>
              addDialog({
                headline: 'افزودن روز',
                body: html`
                  <chips-container-widget class="body" style="padding: 8px;">
                    ${repeat(
                      this.#days.filter((day) => !this.courseSessionDays?.includes?.(day)),
                      (day) => day,
                      (day) =>
                        html`
                          <chip-widget
                            icon="add_circle"
                            text=${day}
                            @click=${() => {
                              this.#addCourseSessionDay(day);
                              removeDialog();
                            }}
                          ></chip-widget>
                        `,
                    )}
                  </chips-container-widget>
                `,
              })}
          ></button-widget>
        </section-widget>
      </paper-widget>
      <paper-widget full-width>
        <section-widget variant="inputs">
          <typography-widget variant="headline">تدریس‌یار</typography-widget>
          <input-widget data-key="taName" variant="text" label="نام استاد"></input-widget>
          <input-widget data-key="taGroup" variant="number" label="گروه"></input-widget>
          <input-widget
            data-key="taSessionStartTime"
            variant="time"
            label="ساعت شروع جلسه"
          ></input-widget>
          <input-widget
            data-key="taSessionEndTime"
            variant="time"
            label="ساعت پایان جلسه"
          ></input-widget>
          ${this.taSessionDays?.length
            ? html`
                <chips-container-widget>
                  ${repeat(
                    this.taSessionDays,
                    (day) => day,
                    (day) =>
                      html`
                        <chip-widget
                          icon="cancel"
                          text=${day}
                          @click=${() => this.#deleteTASessionDay(day)}
                        ></chip-widget>
                      `,
                  )}
                </chips-container-widget>
              `
            : nothing}
        </section-widget>
        <section-widget variant="buttons">
          <button-widget
            slot="trailing"
            variant="text"
            text="افزودن روز"
            icon="today"
            @click=${() =>
              addDialog({
                headline: 'افزودن روز',
                body: html`
                  <chips-container-widget class="body" style="padding: 8px;">
                    ${repeat(
                      this.#days.filter((day) => !this.taSessionDays?.includes?.(day)),
                      (day) => day,
                      (day) =>
                        html`
                          <chip-widget
                            icon="add_circle"
                            text=${day}
                            @click=${() => {
                              this.#addTASessionDay(day);
                              removeDialog();
                            }}
                          ></chip-widget>
                        `,
                    )}
                  </chips-container-widget>
                `,
              })}
          ></button-widget>
        </section-widget>
      </paper-widget>
    `;
  }

  #deleteCourseSessionDay(day: SessionDay) {
    this.courseSessionDays = this.courseSessionDays!.filter((d) => d !== day);
  }

  #addCourseSessionDay(day: SessionDay) {
    this.courseSessionDays = [...(this.courseSessionDays ?? []), day];
  }

  #deleteTASessionDay(day: SessionDay) {
    this.taSessionDays = this.taSessionDays!.filter((d) => d !== day);
  }

  #addTASessionDay(day: SessionDay) {
    this.taSessionDays = [...(this.taSessionDays ?? []), day];
  }

  #validateForm() {
    if (this.#courseName!.value!) this.#courseName!.invalid = false;
    else {
      this.#courseName!.invalid = true;
      return false;
    }

    if (this.#examDate!.value! || this.#examStartTime!.value! || this.#examEndTime!.value!) {
      if (!this.#examDate!.value!) {
        this.#examDate!.invalid = true;
        return false;
      } else this.#examDate!.invalid = false;

      if (!this.#examStartTime!.value!) {
        this.#examStartTime!.invalid = true;
        return false;
      } else this.#examStartTime!.invalid = false;

      if (!this.#examEndTime!.value!) {
        this.#examEndTime!.invalid = true;
        return false;
      } else this.#examEndTime!.invalid = false;

      const date = this.#examDate!.value.split('/');
      const [month, day] = date.map(Number);

      if (
        date.length !== 2 ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > (month > 0 && month < 7 ? 31 : 30)
      ) {
        this.#examDate!.invalid = true;
        return false;
      } else this.#examDate!.invalid = false;

      if (checkIfTimeIsWrong(<Time>this.#examStartTime!.value!, <Time>this.#examEndTime!.value!)) {
        this.#examEndTime!.invalid = true;
        return false;
      } else this.#examEndTime!.invalid = false;
    }

    if (this.#sessionStartTime!.value!) this.#sessionStartTime!.invalid = false;
    else {
      this.#sessionStartTime!.invalid = true;
      return false;
    }

    if (this.#sessionEndTime!.value!) this.#sessionEndTime!.invalid = false;
    else {
      this.#sessionEndTime!.invalid = true;
      return false;
    }

    if (
      checkIfTimeIsWrong(<Time>this.#sessionStartTime!.value!, <Time>this.#sessionEndTime!.value!)
    ) {
      this.#sessionEndTime!.invalid = true;
      return false;
    } else this.#sessionEndTime!.invalid = false;

    if (this.#taSessionStartTime!.value! || this.#taSessionEndTime!.value!) {
      if (this.#taSessionStartTime!.value!) this.#taSessionStartTime!.invalid = false;
      else {
        this.#taSessionStartTime!.invalid = true;
        return false;
      }

      if (this.#taSessionEndTime!.value!) this.#taSessionEndTime!.invalid = false;
      else {
        this.#taSessionEndTime!.invalid = true;
        return false;
      }

      if (
        checkIfTimeIsWrong(
          <Time>this.#taSessionStartTime!.value!,
          <Time>this.#taSessionEndTime!.value!,
        )
      ) {
        this.#taSessionEndTime!.invalid = true;
        return false;
      } else this.#taSessionEndTime!.invalid = false;
    }

    return true;
  }

  #createCourse(): Course {
    return {
      name: this.#courseName!.value!,
      professor: this.#professorName!.value ? this.#professorName!.value : undefined,
      sessions: {
        days: this.courseSessionDays!,
        time: {
          from: <Time>this.#sessionStartTime!.value!,
          to: <Time>this.#sessionEndTime!.value!,
        },
      },
      exam:
        this.#examDate!.value && this.#examStartTime!.value && this.#examEndTime!.value
          ? {
              date: <ExamDate>this.#examDate!.value!,
              time: {
                from: <Time>this.#examStartTime!.value!,
                to: <Time>this.#examEndTime!.value!,
              },
            }
          : undefined,
      group: this.#courseGroup!.value! ? Number(this.#courseGroup!.value!) : undefined,
      ta:
        this.#taSessionStartTime!.value! &&
        this.#taSessionEndTime!.value! &&
        this.taSessionDays?.length
          ? {
              name: this.#taName!.value! ? this.#taName!.value! : undefined,
              sessions: {
                days: this.taSessionDays,
                time: {
                  from: <Time>this.#taSessionStartTime!.value!,
                  to: <Time>this.#taSessionEndTime!.value!,
                },
              },
              group: this.#taGroup!.value! ? Number(this.#taGroup!.value!) : undefined,
            }
          : undefined,
    };
  }

  #submitForm() {
    if (this.#validateForm()) {
      if (!this.courseSessionDays?.length)
        addDialog({
          headline: 'خطا',
          body: html`
            <section-widget variant="paragraphs">
              <typography-widget variant="text">روزهای جلسه درس را وارد کنید.</typography-widget>
            </section-widget>
          `,
        });
      else if (
        this.#taSessionStartTime!.value! &&
        this.#taSessionEndTime!.value! &&
        !this.taSessionDays?.length
      )
        addDialog({
          headline: 'خطا',
          body: html`
            <section-widget variant="paragraphs">
              <typography-widget variant="text">
                روزهای جلسه تدریس‌یار را وارد کنید.
              </typography-widget>
            </section-widget>
          `,
        });
      else {
        const course = this.#createCourse();

        if (course.ta && checkIfSessionsInterfere(course.sessions, course.ta.sessions))
          addDialog({
            headline: 'خطا',
            body: html`
              <section-widget variant="paragraphs">
                <typography-widget variant="text">
                  جلسات درس و جلسات تدریس‌یار تداخل دارند.
                </typography-widget>
              </section-widget>
            `,
          });
        else {
          const allCourses = [...courses.state];
          let hasErrors: boolean = false;

          for (const c of allCourses) {
            if (c.name === course.name) {
              addDialog({
                headline: 'خطا',
                body: html`
                  <section-widget variant="paragraphs">
                    <typography-widget variant="text">نام درس تکراری است.</typography-widget>
                  </section-widget>
                `,
              });

              hasErrors = true;

              break;
            } else if (
              course.exam &&
              c.exam === course.exam &&
              checkIfTimesInterfere(course.exam.time, c.exam.time)
            ) {
              addDialog({
                headline: 'خطا',
                body: html`
                  <section-widget variant="paragraphs">
                    <typography-widget variant="text">
                      امتحان این درس با درس ${c.name} تداخل دارد.
                    </typography-widget>
                  </section-widget>
                `,
              });

              hasErrors = true;

              break;
            } else if (checkIfSessionsInterfere(course.sessions, c.sessions)) {
              addDialog({
                headline: 'خطا',
                body: html`
                  <section-widget variant="paragraphs">
                    <typography-widget variant="text">
                      جلسات این درس با جلسات درس ${c.name} تداخل دارند.
                    </typography-widget>
                  </section-widget>
                `,
              });

              hasErrors = true;

              break;
            } else if (course.ta && checkIfSessionsInterfere(course.ta.sessions, c.sessions)) {
              addDialog({
                headline: 'خطا',
                body: html`
                  <section-widget variant="paragraphs">
                    <typography-widget variant="text">
                      جلسات تدریس‌یار این درس با جلسات درس ${c.name} تداخل دارند.
                    </typography-widget>
                  </section-widget>
                `,
              });

              hasErrors = true;

              break;
            } else if (c.ta && checkIfSessionsInterfere(course.sessions, c.ta.sessions)) {
              addDialog({
                headline: 'خطا',
                body: html`
                  <section-widget variant="paragraphs">
                    <typography-widget variant="text">
                      جلسات این درس با جلسات تدریس‌یار درس ${c.name} تداخل دارند.
                    </typography-widget>
                  </section-widget>
                `,
              });

              hasErrors = true;

              break;
            } else if (
              course.ta &&
              c.ta &&
              checkIfSessionsInterfere(course.ta.sessions, c.ta.sessions)
            ) {
              addDialog({
                headline: 'خطا',
                body: html`
                  <section-widget variant="paragraphs">
                    <typography-widget variant="text">
                      جلسات تدریس‌یار این درس با جلسات تدریس‌یار درس ${c.name} تداخل دارند.
                    </typography-widget>
                  </section-widget>
                `,
              });

              hasErrors = true;

              break;
            }
          }

          if (!hasErrors)
            addDialog({
              headline: 'توجه',
              body: html`
                <section-widget variant="paragraphs">
                  <typography-widget variant="text">
                    آیا از درستی اطلاعات وارد شده مطمئنید؟
                  </typography-widget>
                </section-widget>
              `,
              button: {
                text: 'تایید اطلاعات',
                action: () => {
                  addCourse(course);
                  history.back();
                  addSnackbar({ text: `درس ${course.name} افزوده شد.` });
                },
              },
            });
        }
      }
    }
  }

  override addedCallback() {
    super.addedCallback();
    setAppBarOptions({
      headline: 'افزودن درس',
      leading: {
        icon: 'arrow_forward',
        action: () =>
          addDialog({
            headline: 'هشدار',
            body: html`
              <section-widget variant="paragraphs">
                <typography-widget variant="text">آیا می‌خواهید خارج شوید؟</typography-widget>
              </section-widget>
            `,
            button: { text: 'خروج', action: () => history.back() },
          }),
      },
      trailing: html`
        <button-widget
          variant="text"
          icon="done"
          @click=${this.#submitForm.bind(this)}
        ></button-widget>
      `,
    });
  }

  override mountedCallback() {
    super.mountedCallback();

    this.#courseName = <InputWidget>(
      this.shadowRoot!.querySelector('input-widget[data-key="courseName"]')
    );

    this.#professorName = <InputWidget>(
      this.shadowRoot!.querySelector('input-widget[data-key="professorName"]')
    );

    this.#sessionStartTime = <InputWidget>(
      this.shadowRoot!.querySelector('input-widget[data-key="sessionStartTime"]')
    );

    this.#sessionEndTime = <InputWidget>(
      this.shadowRoot!.querySelector('input-widget[data-key="sessionEndTime"]')
    );

    this.#examDate = <InputWidget>(
      this.shadowRoot!.querySelector('input-widget[data-key="examDate"]')
    );

    this.#examStartTime = <InputWidget>(
      this.shadowRoot!.querySelector('input-widget[data-key="examStartTime"]')
    );

    this.#examEndTime = <InputWidget>(
      this.shadowRoot!.querySelector('input-widget[data-key="examEndTime"]')
    );

    this.#courseGroup = <InputWidget>(
      this.shadowRoot!.querySelector('input-widget[data-key="courseGroup"]')
    );

    this.#taName = <InputWidget>this.shadowRoot!.querySelector('input-widget[data-key="taName"]');

    this.#taSessionStartTime = <InputWidget>(
      this.shadowRoot!.querySelector('input-widget[data-key="taSessionStartTime"]')
    );

    this.#taSessionEndTime = <InputWidget>(
      this.shadowRoot!.querySelector('input-widget[data-key="taSessionEndTime"]')
    );

    this.#taGroup = <InputWidget>this.shadowRoot!.querySelector('input-widget[data-key="taGroup"]');
  }
}
