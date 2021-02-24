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
  private _time: number;

  /**
   * Creates a class that has dates that have been parsed. These date objects can also be compiled into complete dates.
   * @param day the date
   * @param month the month
   * @param year the year
   * @param hours the hours
   * @param minutes the minutes
   */

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
  get time() {
    return this._time
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
  set time (time) {
    let date = new Date(time)
    this._minutes = date.getMinutes();
    this._hours = date.getHours()
    this._day = date.getDate();
    this._month = date.getMonth();
    this._year = date.getFullYear()
    this._time = time;
    return
  }

  /**
   * Compiles the date object into something JavaScript can understand
   *
   * @return {Date}  A date that has been compiled
   * @memberof ParsedDate
   */
  public compileDate(): number {
    let parsedDate = new Date;
    parsedDate.setFullYear(this._year);
    parsedDate.setMonth(this._month);
    parsedDate.setDate(this._day);
    parsedDate.setHours(this._hours);
    parsedDate.setMinutes(this._minutes);
    let parsedTimezone = parsedDate.getTimezoneOffset() * 60000;
    let utc = parsedDate.getTime() + parsedTimezone;
    let pst = utc + (480 * 60000);
    return pst;
  }

  /**
   * Creates a string so events can display a string
   * @returns {string} A string that is in month, day, year, hours, and minutes
   * @memberof ParsedDate
   */
  public eventPresentDate(): string {
    let returnMinutes: number | string;
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
