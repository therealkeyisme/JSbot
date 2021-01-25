const regExpObj = {
  allWeekDays: /\b(mo(n(day)?)?|tu(e(s(day)?)?)?|we(d(nesday)?)?|th(u(r(s(day)?)?)?)?|fr(i(day)?)?|sa(t(urday)?)?|su(n(day)?)?)\b/,
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

const isThisValid = (m) => {
  let { allWeekDays, amOrPm, date, time24hr, tomorrow, now } = regExpObj;
  if (allWeekDays.test(m)) return true;
  if (amOrPm.test(m)) return true;
  if (date.test(m)) return true;
  if (time24hr.test(m)) return true;
  if (tomorrow.test(m)) return true;
  if (now.test(m)) return true;
  if (today.test(m)) return true;
};

module.exports = {
  regExpObj,
  isThisValid,
};
