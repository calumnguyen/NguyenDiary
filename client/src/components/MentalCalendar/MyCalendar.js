import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const DATE_FORMAT = "DD/MM/YYYY";
const DATE_FORMAT_WITH_TIME = "h:mm A DD/MM/YYYY";

function MyCalendar(props) {
  const [selectedDate, onDateChangeFinal] = useState(props.selectedDate);
  const [selectedDateTemp, onDateChange] = useState(props.selectedDate);
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

  const showConfirmationForDateChange = (changedTempDate) => {
    let modifiedDate = new Date(
      moment(changedTempDate).millisecond(0).seconds(0).second(0).minute(0).hour(0)
    );
    let firstDate = moment(modifiedDate).format(DATE_FORMAT);
    let secondDate = moment(selectedDate).format(DATE_FORMAT);
    if (firstDate !== secondDate && props.formStarted) {
      confirmAlert({
        title: "Confirm Date Change",
        message: "Finish all steps, else everything will be discarded",
        buttons: [
          {
            label: "Yes, confirm.",
            onClick: () => {
              onDateChangeFinal(changedTempDate);
            },
          },
          {
            label: "No, back to editing",
            onClick: () => {},
          },
        ],
      });
    } else{
      onDateChangeFinal(changedTempDate);
    }
  };
  useEffect(() => {
    props.handleDateChange(selectedDate);
  }, [selectedDate]);
  useEffect(() => {
    showConfirmationForDateChange(selectedDateTemp);
  }, [selectedDateTemp]);
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
  const handleUserChange = async (userId) => {
    await props.changeSelectedUser(userId)
    handleCalendarToggle();
  }
  const getUsersList = () => {
    let selfUser = [];
    let selfSelectedUser = [];
    let otherUser = [];
    props.allUsers.forEach((user) => {
      if(user._id===props.authUserId){
        selfUser.push(
          <li className="list-group-item d-flex" onClick={() => handleUserChange(user._id)}>
            Your Mental Calendar
          </li>
        )
      } else if(user._id===props.selectedUserId){
        selfSelectedUser.push(
          <li className="list-group-item d-flex" onClick={() => handleUserChange(user._id)}>
            {user.information.fullName}
          </li>
        )
      } else{
        otherUser.push(
          <li className="list-group-item" onClick={() => handleUserChange(user._id)}>
            {user.information.fullName}
          </li>
        );
      }
    })
    return [...selfSelectedUser,...selfUser, ...otherUser];
  }
  return (
    <div className="theme_calendar">
      <div className="calendar_header">
        <div className="row">
          <div className="col-sm-10 col-xs-10">
            <p className="calendar_title">{(props.selectedUserId !== props.authUserId)?props.selectedUser.information.fullName:"Your Mental Calendar"}</p>
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
