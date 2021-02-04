export const regExpObj = {
  allWeekDays: /\b((m|M)o(n(day)?)?|(t|T)u(e(s(day)?)?)?|(w|W)e(d(nesday)?)?|(t|T)h(u(r(s(day)?)?)?)?|(f|F)r(i(day)?)?|(s|S)a(t(urday)?)?|(s|S)u(n(day)?)?)\b/,
  monday: /\b((mon)(day)?)\b/,
  tuesday: /\b((tues)(day)?)\b/,
  wednesday: /\b((wed(nes)?)(day)?)\b/,
  thursday: /\b((thur(s)?)(day)?)\b/,
  friday: /\b((fri)(day)?)\b/,
  saturday: /\b((sat(ur)?)(day)?)\b/,
  sunday: /\b((sun)(day)?)\b/,
  amOrPm: /\b([0]?[0-9]|1[0-2]):?([0-5]?\d?)([ap])m\b/,
  am: /\b([0]?[0-9]|1[0-2]):?([0-5]?\d?)am\b/,
  pm: /\b([0]?[0-9]|1[0-2]):?([0-5]?\d?)pm\b/,
  date: /\b(0?[1-9]|1[012])([\/\-])(0?[1-9]|[12]\d|3[01])\2(\d{4})\b/,
  time24hr: /\b([01]?[0-9]|2[0-3]):([0-5]\d)\b/,
  tomorrow: /\b(tomorrow)\b/,
  now: /\b(now)\b/,
  today: /\b(today)\b/,
};

export const weekDayList = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
