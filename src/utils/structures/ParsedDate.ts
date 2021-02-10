/**
 * Class that contains date object blueprint
 *
 * @export ParsedDate
 * @class ParsedDate
 */
export default class ParsedDate {
  private _day: number;
  private _month: number;
  private _year: number;
  private _hours: number;
  private _minutes: number;

  /**
   * Creates a class that has dates that have been parsed. These date objects can also be compiled into complete dates.
   * @param day the date
   * @param month the month
   * @param year the year
   * @param hours the hours
   * @param minutes the minutes
   */
  constructor(
    day: number,
    month: number,
    year: number,
    hours: number,
    minutes: number
  ) {
    this._day = day;
    this._month = month;
    this._year = year;
    this._hours = hours;
    this._minutes = minutes;
  }

  get day() {
    return this._day;
  }
  get month() {
    return this._month;
  }
  get year() {
    return this._year;
  }
  get hours() {
    return this._hours;
  }
  get minutes() {
    return this._minutes;
  }
  set day(day) {
    this._day = day;
  }
  set month(month) {
    this._month = month;
  }
  set year(year) {
    this._year = year;
  }
  set hours(hours) {
    this._hours = hours;
  }
  set minutes(minutes) {
    this._minutes = minutes;
  }

  /**
   * Compiles the date object into something JavaScript can understand
   *
   * @return {Date}  A date that has been compiled
   * @memberof ParsedDate
   */
  public compileDate(): Date {
    let parsedDate = new Date(Date.now());
    parsedDate.setFullYear(this._year);
    parsedDate.setMonth(this._month);
    parsedDate.setDate(this._day);
    parsedDate.setHours(this._hours);
    parsedDate.setMinutes(this._minutes);
    return parsedDate;
  }

  /**
   * Creates a string so events can display a string
   * @returns {string} A string that is in month, day, year, hours, and minutes
   * @memberof ParsedDate
   */
  public eventPresentDate(): string {
    let returnMinutes: number | string;
    console.log(this._minutes);
    if (
      this._minutes == NaN ||
      this._minutes == 0 ||
      this._minutes == undefined
    ) {
      returnMinutes = "00";
    } else {
      returnMinutes = this._minutes;
    }

    return `${this._month + 1}/${this._day}/${this._year} at ${
      this._hours
    }:${returnMinutes}`;
  }
}
