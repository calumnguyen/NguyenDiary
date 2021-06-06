import react, { Component, useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function MyCalendar(props) {
  const [selectedDate, onDateChange] = useState(props.selectedDate);
  const formatDate = (date, format) => {
    let daynumber = (new Date(date)).getDay();
    switch(daynumber){
      case 0: return 'Su';
      case 6: return 'Sa';
      case 5: return 'F';
      case 4: return 'Th';
      case 3: return 'W';
      case 2: return 'T';
      case 1: return 'M';
    }
    return 1;
  }
  useEffect(() => {
    props.handleDateChange(selectedDate);
  }, [selectedDate]);
  useEffect(() => {
    onDateChange(props.selectedDate);
  }, [props.selectedDate]);
  return (
    <div className="theme_calendar">
      <div className="calendar_header">
        <div className="row">
          <div className="col-sm-10 col-xs-10">
            <p className="calendar_title">Your Mental Calendar</p>
          </div>
          <div className="col-sm-2 col-xs-2">
            <div className="calendar_toggle wrapper">
              <input
                type="checkbox"
                id="menuToggler"
                className="input-toggler"
              />
              <label htmlFor="menuToggler" className="menu-toggler">
                <span className="menu-toggler__line"></span>
                <span className="menu-toggler__line"></span>
                <span className="menu-toggler__line"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <Calendar
        onChange={onDateChange}
        value={selectedDate}
        showNeighboringMonth={false}
        className={["theme-calendar"]}
        // formatShortWeekday={(locale, date) => formatDate(date, 'dd')}
      />
    </div>
  );
}

export default MyCalendar;
