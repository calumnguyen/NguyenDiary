import react, { Component, useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import myImg from "../../../assets/img/default_profile_pics/others.png";

function MyCalendar(props) {
  const [selectedDate, onDateChange] = useState(props.selectedDate);
  const [isCalendarToggleChecked, onCalendarToggle] = useState(false);
  const handleCalendarToggle = () => {
    onCalendarToggle(!isCalendarToggleChecked);
  };

  let datesHavingEntry = props.allDates
    ? props.allDates.diary.map((day) => day.day)
    : null;

  const formatDate = (date, format) => {
    let daynumber = new Date(date).getDay();
    switch (daynumber) {
      case 0:
        return "Su";
      case 6:
        return "Sa";
      case 5:
        return "F";
      case 4:
        return "Th";
      case 3:
        return "W";
      case 2:
        return "T";
      case 1:
        return "M";
    }
    return 1;
  };
  useEffect(() => {
    props.handleDateChange(selectedDate);
  }, [selectedDate]);
  useEffect(() => {
    onDateChange(props.selectedDate);
  }, [props.selectedDate]);

  let todaysDate = new Date(
    moment().millisecond(0).seconds(0).second(0).minute(0).hour(0)
  );
  const prev7DaysDate = moment(todaysDate).subtract(7, "days");
  const selectClassesForTile = ({ activeStartDate, date, view }) => {
    const newDate = moment(date).format("DD-MM-YYYY");
    if (
      datesHavingEntry &&
      datesHavingEntry.includes(newDate) &&
      moment(date).isSameOrBefore(todaysDate, "days")
    ) {
      return "react-calendar_single_whiteBorder_tile";
    } else if (
      datesHavingEntry &&
      !datesHavingEntry.includes(newDate) &&
      moment(date).isAfter(prev7DaysDate, "days") &&
      moment(date).isBefore(todaysDate, "days")
    ) {
      return "react-calendar_single_dotted_tile";
    }
  };
  const getUsersList = () => {
    let selfUser = [];
    let otherUser = [];
    props.allUsers.forEach((user) => {
      if(user._id===props.authUserId){
        selfUser.push(
          <li className="list-group-item d-flex">
            Your Mental Calendar
          </li>
        )
      } else{
        otherUser.push(
          <li className="list-group-item">
            {user.information.fullName}
          </li>
        );
      }
    })
    return [...selfUser, ...otherUser];
  }
  return (
    <div className="theme_calendar">
      <div className="calendar_header">
        <div className="row">
          <div className="col-sm-10 col-xs-10">
            <p className="calendar_title">Your Mental Calendar</p>
          </div>
          <div className="col-sm-2 col-xs-2">
            <div
              className="calendar_toggle wrapper"
              onClick={handleCalendarToggle}
            >
              <input
                type="checkbox"
                className="input-toggler"
                checked={isCalendarToggleChecked}
              />
              <label htmlFor="menuToggler" className="menu-toggler">
                <span className="menu-toggler__line"></span>
                <span className="menu-toggler__line"></span>
                <span className="menu-toggler__line"></span>
              </label>
            </div>
          </div>
        </div>
        {isCalendarToggleChecked ? (
          <div className="row">
            <div className="col-sm-12">
              <div className="all_users_profile">
                <ul className="list-group">
                  {props.allUsers && props.allUsers.length > 0 ? (
                    <>
                      {getUsersList()}
                    </>
                  ) : null}
                </ul>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <Calendar
        onChange={onDateChange}
        value={selectedDate}
        showNeighboringMonth={false}
        className={["theme-calendar"]}
        tileClassName={selectClassesForTile}
        // formatShortWeekday={(locale, date) => formatDate(date, 'dd')}
      />
    </div>
  );
}

export default MyCalendar;
