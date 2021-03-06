import { Message } from "discord.js";
import { regExpObj, weekDayList } from "./Constants";
import ParsedDate from "./structures/ParsedDate";

/**
 * This function takes a human input for time and converts it into something the computer can understand
 *
 * @param {string} inputTime a human input for a time value
 * @returns {ParsedDate} an object that contains day month year hours and minutes in computer lang
 */
export const DateParser = (inputTime: string): ParsedDate => {
  let currentTime = new Date(Date.now());
  let currentTimeOffset = currentTime.getTimezoneOffset() 
  let returnObject = new ParsedDate();

  const allWeekDays = regExpObj.allWeekDays.exec(inputTime);
  const date = regExpObj.date.exec(inputTime);
  const today = regExpObj.today.exec(inputTime);
  const tomorrow = regExpObj.today.exec(inputTime);
  const am = regExpObj.am.exec(inputTime);
  const pm = regExpObj.pm.exec(inputTime);
  const time24hr = regExpObj.time24hr.exec(inputTime);
  if (allWeekDays) {
    let weekDayNumber = weekDayList.findIndex(
      (element) => element == allWeekDays[1]
    );
    if (weekDayNumber <= currentTime.getDay()) weekDayNumber += 7;
    returnObject.day =
      weekDayNumber - currentTime.getDay() + currentTime.getDate();
  }
  if (date) {
    returnObject.day = parseInt(date[3]);
    returnObject.month = parseInt(date[1]) - 1;
    returnObject.year = parseInt(date[4]);
  }
  if (today) {
    returnObject.day = currentTime.getDate();
    returnObject.month = currentTime.getMonth();
    returnObject.year = currentTime.getFullYear();
  }
  if (tomorrow) {
    returnObject.day = currentTime.getDate() + 1;
    returnObject.month = currentTime.getMonth();
    returnObject.year = currentTime.getFullYear();
  }
  if (am) {
    if (parseInt(am[1]) == 12) returnObject.hours = 0;
    else returnObject.hours = parseInt(am[1]);

    if (am[2] != "") returnObject.minutes = parseInt(am[2]);
  }
  if (pm) {
    if (parseInt(pm[1]) == 12) returnObject.hours = 12;
    else returnObject.hours = parseInt(pm[1]) + 12;
    if (pm[2] != "") returnObject.minutes = parseInt(pm[2]);
  }
  if (time24hr) {
    returnObject.hours = parseInt(time24hr[1]);
    returnObject.minutes = parseInt(time24hr[2]);
  }
  return returnObject;
};

/**
 * A filter for a collector that checks if there's a date in a string
 * Any remarks you have about the function/method.
 *
 * @param {Message} message a discord.js message that is passed in
 * @returns {boolean} returns true if theres a date in the message
 */
export const eventTimeFilter = (message: Message): boolean => {
  const content = message.content;
  if (
    (regExpObj.amOrPm.test(content) || regExpObj.time24hr.test(content)) &&
    (regExpObj.allWeekDays.test(content) ||
      regExpObj.date.test(content) ||
      regExpObj.tomorrow.test(content) ||
      regExpObj.now.test(content) ||
      regExpObj.today.test(content))
  ) {
    return true;
  }
};
