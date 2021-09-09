import { Nexstate } from 'nexstate/nexstate.js';

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

const storedCourses = localStorage.getItem('courses');

const defaultState =
  storedCourses !== null ? new Set<Course>([...JSON.parse(storedCourses)]) : new Set<Course>();

export const courses = new Nexstate<Set<Course>>(defaultState);

courses.runAndSubscribe((courses) => localStorage.setItem('courses', JSON.stringify([...courses])));

export const addCourse = (course: Course) =>
  courses.setState((courses) => {
    courses.add(course);
    return new Set([...courses]);
  });

export const deleteCourse = (course: Course) =>
  courses.setState((courses) => {
    courses.delete(course);
    return new Set([...courses]);
  });
