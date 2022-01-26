import { Store } from 'nexstate/nexstate.js';

export type SessionDay =
  | 'جمعه'
  | 'پنج‌شنبه'
  | 'چهارشنبه'
  | 'سه‌شنبه'
  | 'دوشنبه'
  | 'یک‌شنبه'
  | 'شنبه';

export type Time = `${number}:${number}`;
export type TimeRange = { from: Time; to: Time };
export type ExamDate = `${number}/${number}`;
export type Sessions = { days: SessionDay[]; time: TimeRange };
export type Exam = { date: ExamDate; time: TimeRange };

export type Course = {
  name: string;
  professor?: string;
  sessions: Sessions;
  exam?: Exam;
  group?: number;
  ta?: { name?: string; sessions: Sessions; group?: number };
};

export class CoursesStore extends Store {
  courses: Set<Course>;

  constructor() {
    super();

    const storedCourses = localStorage.getItem('courses');

    this.courses =
      storedCourses !== null
        ? new Set<Course>([...JSON.parse(storedCourses)])
        : new Set<Course>();
  }

  addCourse(course: Course) {
    this.setState(() => this.courses.add(course));
  }

  deleteCourse(course: Course) {
    this.setState(() => this.courses.delete(course));
  }
}

export const coursesStore = new CoursesStore();

coursesStore.runAndSubscribe(() =>
  localStorage.setItem('courses', JSON.stringify([...coursesStore.courses])),
);
