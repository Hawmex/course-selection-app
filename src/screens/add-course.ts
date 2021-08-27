import { repeat } from 'lit-html/directives/repeat.js';
import 'nexinterface/dist/button/button.js';
import 'nexinterface/dist/chip/chip.js';
import 'nexinterface/dist/chip/chips-container.js';
import { addDialog, removeDialog } from 'nexinterface/dist/dialog/dialog';
import 'nexinterface/dist/input/input.js';
import { InputWidget } from 'nexinterface/dist/input/input.js';
import 'nexinterface/dist/paper/paper.js';
import { Screen } from 'nexinterface/dist/screen/screen.js';
import 'nexinterface/dist/section/section.js';
import { addSnackbar } from 'nexinterface/dist/snackbar/snackbar';
import { setTopBarOptions } from 'nexinterface/dist/top-bar/top-bar';
import 'nexinterface/dist/typography/typography.js';
import { html, nothing, WidgetTemplate } from 'nexwidget';
import { addCourse, Course, courses, Time, TimeRange } from '../courses.js';

declare global {
  interface HTMLElementTagNameMap {
    'add-course-screen': AddCourseScreen;
  }
}

export interface AddCourseScreen {
  get courseSessionDays(): string[] | undefined;
  set courseSessionDays(v: string[] | undefined);

  get TASessionDays(): string[] | undefined;
  set TASessionDays(v: string[] | undefined);
}

export class AddCourseScreen extends Screen {
  static #checkIfTimesInterfere(first: TimeRange, second: TimeRange) {
    const [firstStartHour, firstStartMinute] = first.from.split(':').map(Number);
    const [firstEndHour, firstEndMinute] = first.to.split(':').map(Number);

    const [secondStartHour, secondStartMinute] = second.from.split(':').map(Number);
    const [secondEndHour, secondEndMinute] = second.to.split(':').map(Number);

    const firstStartStamp = firstStartHour * 60 + firstStartMinute;
    const firstEndStamp = firstEndHour * 60 + firstEndMinute;

    const secondStartStamp = secondStartHour * 60 + secondStartMinute;
    const secondEndStamp = secondEndHour * 60 + secondEndMinute;

    if (
      (firstStartStamp >= secondStartStamp && firstStartStamp < secondEndStamp) ||
      (firstEndStamp > secondStartStamp && firstEndStamp <= secondEndStamp)
    )
      return true;
    else return false;
  }

  static #checkIfTimeIsWrong(start: Time, end: Time) {
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    if (startHour * 60 + startMinute >= endHour * 60 + endMinute) return true;
    else return false;
  }

  static #checkIfSessionsInterfere(
    firstDays: string[],
    secondDays: string[],
    firstTimes: TimeRange,
    secondTimes: TimeRange,
  ) {
    const commonDays = firstDays.filter((day) => secondDays.includes(day));

    if (commonDays.length && AddCourseScreen.#checkIfTimesInterfere(firstTimes, secondTimes))
      return true;
    else return false;
  }

  #days = ['شنبه', 'یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

  #courseName?: InputWidget;
  #professorName?: InputWidget;
  #sessionStartTime?: InputWidget;
  #sessionEndTime?: InputWidget;
  #examDate?: InputWidget;
  #examStartTime?: InputWidget;
  #examEndTime?: InputWidget;
  #courseGroupNumber?: InputWidget;
  #assistantName?: InputWidget;
  #TASessionStartTime?: InputWidget;
  #TASessionEndTime?: InputWidget;
  #TAGroupNumber?: InputWidget;

  override addedCallback() {
    super.addedCallback();
    setTopBarOptions({
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
            button: { text: 'بله', action: () => history.back() },
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

    this.#courseGroupNumber = <InputWidget>(
      this.shadowRoot!.querySelector('input-widget[data-key="courseGroupNumber"]')
    );

    this.#assistantName = <InputWidget>(
      this.shadowRoot!.querySelector('input-widget[data-key="assistantName"]')
    );

    this.#TASessionStartTime = <InputWidget>(
      this.shadowRoot!.querySelector('input-widget[data-key="TASessionStartTime"]')
    );

    this.#TASessionEndTime = <InputWidget>(
      this.shadowRoot!.querySelector('input-widget[data-key="TASessionEndTime"]')
    );

    this.#TAGroupNumber = <InputWidget>(
      this.shadowRoot!.querySelector('input-widget[data-key="TAGroupNumber"]')
    );
  }

  override get template(): WidgetTemplate {
    return html`
      <paper-widget full-width>
        <section-widget variant="inputs">
          <typography-widget variant="headline">درس</typography-widget>
          <input-widget data-key="courseName" type="text" label="نام درس*"></input-widget>
          <input-widget data-key="professorName" type="text" label="نام استاد"></input-widget>
          <input-widget
            data-key="courseGroupNumber"
            type="number"
            label="گروه"
            placeholder="نمونه: 12"
          ></input-widget>
          <input-widget
            data-key="examDate"
            type="text"
            label="تاریخ امتحان"
            placeholder="نمونه: 10/28"
          ></input-widget>
          <input-widget
            data-key="examStartTime"
            type="time"
            label="ساعت شروع امتحان"
          ></input-widget>
          <input-widget data-key="examEndTime" type="time" label="ساعت پایان امتحان"></input-widget>
          <input-widget
            data-key="sessionStartTime"
            type="time"
            label="ساعت شروع جلسه*"
          ></input-widget>
          <input-widget
            data-key="sessionEndTime"
            type="time"
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
          <input-widget data-key="assistantName" type="text" label="نام استاد"></input-widget>
          <input-widget data-key="TAGroupNumber" type="number" label="گروه"></input-widget>
          <input-widget
            data-key="TASessionStartTime"
            type="time"
            label="ساعت شروع جلسه"
          ></input-widget>
          <input-widget
            data-key="TASessionEndTime"
            type="time"
            label="ساعت پایان جلسه"
          ></input-widget>
          ${this.TASessionDays?.length
            ? html`
                <chips-container-widget>
                  ${repeat(
                    this.TASessionDays,
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
                      this.#days.filter((day) => !this.TASessionDays?.includes?.(day)),
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

  #deleteCourseSessionDay(day: string) {
    this.courseSessionDays = this.courseSessionDays!.filter((d) => d !== day);
  }

  #addCourseSessionDay(day: string) {
    this.courseSessionDays = [...(this.courseSessionDays ?? []), day];
  }

  #deleteTASessionDay(day: string) {
    this.TASessionDays = this.TASessionDays!.filter((d) => d !== day);
  }

  #addTASessionDay(day: string) {
    this.TASessionDays = [...(this.TASessionDays ?? []), day];
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

      if (
        AddCourseScreen.#checkIfTimeIsWrong(
          <Time>this.#examStartTime!.value!,
          <Time>this.#examEndTime!.value!,
        )
      ) {
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
      AddCourseScreen.#checkIfTimeIsWrong(
        <Time>this.#sessionStartTime!.value!,
        <Time>this.#sessionEndTime!.value!,
      )
    ) {
      this.#sessionEndTime!.invalid = true;
      return false;
    } else this.#sessionEndTime!.invalid = false;

    if (this.#TASessionStartTime!.value! || this.#TASessionEndTime!.value!) {
      if (this.#TASessionStartTime!.value!) this.#TASessionStartTime!.invalid = false;
      else {
        this.#TASessionStartTime!.invalid = true;
        return false;
      }

      if (this.#TASessionEndTime!.value!) this.#TASessionEndTime!.invalid = false;
      else {
        this.#TASessionEndTime!.invalid = true;
        return false;
      }

      if (
        AddCourseScreen.#checkIfTimeIsWrong(
          <Time>this.#TASessionStartTime!.value!,
          <Time>this.#TASessionEndTime!.value!,
        )
      ) {
        this.#TASessionEndTime!.invalid = true;
        return false;
      } else this.#TASessionEndTime!.invalid = false;
    }

    return true;
  }

  #createCourse() {
    return <Course>{
      courseName: this.#courseName!.value!,
      professorName: this.#professorName!.value ? this.#professorName!.value : undefined,
      sessionDays: this.courseSessionDays!,
      sessionTime: {
        from: <Time>this.#sessionStartTime!.value!,
        to: <Time>this.#sessionEndTime!.value!,
      },
      examDate: this.#examDate!.value! ? <`${number}/${number}`>this.#examDate!.value! : undefined,
      examTime:
        this.#examStartTime!.value! && this.#examEndTime!.value!
          ? {
              from: <Time>this.#examStartTime!.value!,
              to: <Time>this.#examEndTime!.value!,
            }
          : undefined,
      groupNumber: this.#courseGroupNumber!.value!
        ? Number(this.#courseGroupNumber!.value!)
        : undefined,
      teachingAssistant:
        this.#TASessionStartTime!.value! &&
        this.#TASessionEndTime!.value! &&
        this.TASessionDays?.length
          ? {
              assistantName: this.#assistantName!.value! ? this.#assistantName!.value! : undefined,
              sessionDays: this.TASessionDays,
              sessionTime: {
                from: <Time>this.#TASessionStartTime!.value!,
                to: <Time>this.#TASessionEndTime!.value!,
              },
              groupNumber: this.#TAGroupNumber!.value!
                ? Number(this.#TAGroupNumber!.value!)
                : undefined,
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
        this.#TASessionStartTime!.value! &&
        this.#TASessionEndTime!.value! &&
        !this.TASessionDays?.length
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

        if (
          course.teachingAssistant?.sessionTime &&
          AddCourseScreen.#checkIfSessionsInterfere(
            course.sessionDays,
            course.teachingAssistant.sessionDays,
            course.sessionTime,
            course.teachingAssistant.sessionTime,
          )
        )
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
            if (c.courseName === course.courseName) {
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
              course.examDate !== undefined &&
              c.examDate === course.examDate &&
              AddCourseScreen.#checkIfTimesInterfere(course.examTime!, c.examTime!)
            ) {
              addDialog({
                headline: 'خطا',
                body: html`
                  <section-widget variant="paragraphs">
                    <typography-widget variant="text">
                      امتحان این درس با درس ${c.courseName} تداخل دارد.
                    </typography-widget>
                  </section-widget>
                `,
              });

              hasErrors = true;

              break;
            } else if (
              AddCourseScreen.#checkIfSessionsInterfere(
                course.sessionDays,
                c.sessionDays,
                course.sessionTime,
                c.sessionTime,
              )
            ) {
              addDialog({
                headline: 'خطا',
                body: html`
                  <section-widget variant="paragraphs">
                    <typography-widget variant="text">
                      جلسات این درس با جلسات درس ${c.courseName} تداخل دارند.
                    </typography-widget>
                  </section-widget>
                `,
              });

              hasErrors = true;

              break;
            } else if (
              course.teachingAssistant?.sessionTime &&
              AddCourseScreen.#checkIfSessionsInterfere(
                course.teachingAssistant.sessionDays,
                c.sessionDays,
                course.teachingAssistant.sessionTime,
                c.sessionTime,
              )
            ) {
              addDialog({
                headline: 'خطا',
                body: html`
                  <section-widget variant="paragraphs">
                    <typography-widget variant="text">
                      جلسات تدریس‌یار این درس با جلسات درس ${c.courseName} تداخل دارند.
                    </typography-widget>
                  </section-widget>
                `,
              });

              hasErrors = true;

              break;
            } else if (
              c.teachingAssistant?.sessionTime &&
              AddCourseScreen.#checkIfSessionsInterfere(
                course.sessionDays,
                c.teachingAssistant.sessionDays,
                course.sessionTime,
                c.teachingAssistant.sessionTime,
              )
            ) {
              addDialog({
                headline: 'خطا',
                body: html`
                  <section-widget variant="paragraphs">
                    <typography-widget variant="text">
                      جلسات این درس با جلسات تدریس‌یار درس ${c.courseName} تداخل دارند.
                    </typography-widget>
                  </section-widget>
                `,
              });

              hasErrors = true;

              break;
            } else if (
              course.teachingAssistant?.sessionTime &&
              c.teachingAssistant?.sessionTime &&
              AddCourseScreen.#checkIfSessionsInterfere(
                course.teachingAssistant.sessionDays,
                c.teachingAssistant.sessionDays,
                course.teachingAssistant.sessionTime,
                c.teachingAssistant.sessionTime,
              )
            ) {
              addDialog({
                headline: 'خطا',
                body: html`
                  <section-widget variant="paragraphs">
                    <typography-widget variant="text">
                      جلسات تدریس‌یار این درس با جلسات تدریس‌یار درس ${c.courseName} تداخل دارند.
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
              headline: 'هشدار',
              body: html`
                <section-widget variant="paragraphs">
                  <typography-widget variant="text"
                    >آیا از درستی اطلاعات وارد شده مطمئنید؟</typography-widget
                  >
                </section-widget>
              `,
              button: {
                text: 'بله',
                action: () => {
                  addCourse(course);
                  history.back();
                  addSnackbar({ text: `درس ${course.courseName} اضافه شد.` });
                },
              },
            });
        }
      }
    }
  }
}

AddCourseScreen.createReactives(['TASessionDays', 'courseSessionDays']);
AddCourseScreen.registerAs('add-course-screen');
