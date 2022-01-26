import { Sessions, Time, TimeRange } from './courses.js';

export const parseTime = (time: Time) => {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
};

export const getSessionLength = (start: Time, end: Time) =>
  parseTime(end) - parseTime(start);

export const checkIfTimeIsWrong = (start: Time, end: Time) => {
  const startStamp = parseTime(start);
  const endStamp = parseTime(end);

  return startStamp >= endStamp;
};

export const checkIfSessionsInterfere = (first: Sessions, second: Sessions) =>
  first.days.filter((day) => second.days.includes(day)).length &&
  checkIfTimesInterfere(first.time, second.time);

export const checkIfTimesInterfere = (first: TimeRange, second: TimeRange) => {
  const firstStartStamp = parseTime(first.from);
  const firstEndStamp = parseTime(first.to);

  const secondStartStamp = parseTime(second.from);
  const secondEndStamp = parseTime(second.to);

  return (
    (firstStartStamp >= secondStartStamp && firstStartStamp < secondEndStamp) ||
    (firstEndStamp > secondStartStamp && firstEndStamp <= secondEndStamp)
  );
};
