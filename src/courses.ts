import { Nexstate } from 'nexstate/nexstate.js';

export type Time = `${number}:${number}`;
export type TimeRange = { from: Time; to: Time };

export type Course = {
  courseName: string;
  professorName?: string;
  sessionDays: string[];
  sessionTime: TimeRange;
  examDate?: `${number}/${number}`;
  examTime?: TimeRange;
  groupNumber?: number;
  teachingAssistant?: {
    assistantName?: string;
    sessionDays: string[];
    sessionTime: TimeRange;
    groupNumber?: number;
  };
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
