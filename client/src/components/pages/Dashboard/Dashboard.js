import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import { Redirect } from "react-router-dom";

import "./Dashboard.scss";
import MyCalendar from "./MyCalendar";
import { loadUser, logout } from "../../../actions/auth";
import { getAllUsers, updateUserImage, saveDiaryAnswers } from "../../../actions/user";

import MyLoader from "../../layout/MyLoader";
import { OCAlertsProvider } from "@opuscapita/react-alerts";
import { OCAlert } from "@opuscapita/react-alerts";
import Alert from "../../layout/Alert";

const DATE_FORMAT = "DD/MM/YYYY";
const DATE_FORMAT_WITH_TIME = "h:mm A DD/MM/YYYY";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
      user: null,
      headerTabs: [
        {
          name: "Mental Calendar",
          status: "active",
          slug: "mentalcalendar",
        },
        {
          name: "Update Image",
          status: "inactive",
          slug: "updateimage",
        },
        {
          name: "Accounts",
          status: "inactive",
          slug: "accounts",
        },
        {
          name: "Logout",
          status: "inactive",
          slug: "logout",
        },
      ],
      isHeaderToggleClicked: false,
      selectedTab: "mentalcalendar",
      hiddenFileInputUpdateImage: React.createRef(),
      diaryQuestions: [
        "How am I feeling today?",
        "What's been worrying me lately?",
        "What did I do today for my body?",
        "What am I doing to bring myself joy?",
        "Who did I talk to today that I know that are in my support corner?",
      ],
      totalDiaryQuestions: 5,
      answeredQuestions: 0,
      formStarted: false,
      diaryAnswers : ["","","","",""]
    };
  }
  async componentDidMount() {
    this.props.getAllUsers();
    await this.props.loadUser();
    if (this.props.auth && this.props.auth.user) {
      this.setState({ user: this.props.auth.user });
    }
  }

  handleDateChange = (changedDate) => {
    this.setState({ selectedDate: changedDate });
  };
  handleLogOutRequest = () => {
    this.props.logout();
  };
  increaseDateByOne = () => {
    let new_date = new Date(moment(this.state.selectedDate).add(1, "days"));
    this.setState({ selectedDate: new_date });
  };
  decreaseDateByOne = () => {
    let new_date = new Date(
      moment(this.state.selectedDate).subtract(1, "days")
    );
    this.setState({ selectedDate: new_date });
  };
  handleTabChange = (idx) => {
    let updatedHeaderTabs = [...this.state.headerTabs];
    updatedHeaderTabs.forEach((tab) => (tab.status = "inactive"));
    updatedHeaderTabs[idx].status = "active";
    let currentTab = updatedHeaderTabs[idx];
    updatedHeaderTabs.splice(idx, 1);
    updatedHeaderTabs.unshift(currentTab);

    this.setState({
      headerTabs: updatedHeaderTabs,
      isHeaderToggleClicked: !this.state.isHeaderToggleClicked,
      selectedTab: currentTab.slug,
    });
    if (currentTab.slug === "logout") {
      this.handleLogOutRequest();
    }
  };
  toggleHeaderOptions = () => {
    this.setState({ isHeaderToggleClicked: !this.state.isHeaderToggleClicked });
  };

  takeToNextStep = () => {
    if(this.state.diaryAnswers[this.state.answeredQuestions].length>25){
      this.setState({answeredQuestions: this.state.answeredQuestions+1});
    } else{
      OCAlert.alertWarning("Please type in atleast 25 words to proceed further", {
        timeOut: 3000,
      });
    }
  }

  finishQuestions = () => {
    OCAlert.alertSuccess("You answered all the questions :)", {
      timeOut: 3000,
    });
    //this.props.saveDiaryAnswers(this.state.user._id,this.state.diaryAnswers,this.selectedDate);
  }
  handleAnswerChange = (e) => {
    let updatedDiaryAnswers = this.state.diaryAnswers;
    updatedDiaryAnswers[this.state.answeredQuestions] = e.target.value;
    this.setState({
      diaryAnswers: updatedDiaryAnswers
    })
  }
  getFormBoxForMentalCalendar = () => {
    let todaysDate = new Date(
      moment().millisecond(0).seconds(0).second(0).minute(0).hour(0)
    );
    let selectedDate = new Date(
      moment(this.state.selectedDate)
        .millisecond(0)
        .seconds(0)
        .second(0)
        .minute(0)
        .hour(0)
    );

    let dateAfter7days = new Date(moment(todaysDate).add(7, "days"));
    let dateBefore7Days = new Date(moment(todaysDate).subtract(7, "days"));

    // let dayDiff = moment(dateAfter7days).diff(selectedDate,"days");
    // let hourDiff = moment(dateAfter7days).diff(selectedDate,"hours");
    // let minDiff = moment(dateAfter7days).diff(selectedDate,"minutes");
    // let secDiff = moment(dateAfter7days).diff(selectedDate,"seconds");
    // console.log(dayDiff, hourDiff, minDiff, secDiff)

    let isSelectedDateInPrev7Days =
      moment(this.state.selectedDate).isAfter(dateBefore7Days) &&
      moment(this.state.selectedDate).isSameOrBefore(todaysDate, "days");
    let isSelectedDateInNext7Days =
      moment(this.state.selectedDate).isBefore(dateAfter7days, "days") &&
      moment(this.state.selectedDate).isAfter(todaysDate, "days");
    let isSelectedDateAfter7Days = moment(
      this.state.selectedDate
    ).isSameOrAfter(dateAfter7days, "days");

    if (this.state.formStarted) {
      return (
        <div className="formBox">
          <p className="diaryQuestion">{this.state.diaryQuestions[this.state.answeredQuestions]} </p>
          <form className="answersForm mt-4">
            {this.state.answeredQuestions === 0 ? (
              <div className="form-group">
                <textarea
                  classname="form-control"
                  name="question1"
                  placeholder="Your answer goes here"
                  value={this.state.diaryAnswers[this.state.answeredQuestions]}
                  onChange={(e) => this.handleAnswerChange(e)}
                />
              </div>
            ) : null}

            {this.state.answeredQuestions === 1 ? (
              <div className="form-group">
                <textarea
                  classname="form-control"
                  name="question2"
                  placeholder="Your answer goes here"
                  value={this.state.diaryAnswers[this.state.answeredQuestions]}
                  onChange={(e) => this.handleAnswerChange(e)}
                />
              </div>
            ) : null}
            {this.state.answeredQuestions === 2 ? (
              <div className="form-group">
                <textarea
                  classname="form-control"
                  name="question3"
                  placeholder="Your answer goes here"
                  value={this.state.diaryAnswers[this.state.answeredQuestions]}
                  onChange={(e) => this.handleAnswerChange(e)}
                />
              </div>
            ) : null}
            {this.state.answeredQuestions == 3 ? (
              <div className="form-group">
                <textarea
                  classname="form-control"
                  name="question4"
                  placeholder="Your answer goes here"
                  value={this.state.diaryAnswers[this.state.answeredQuestions]}
                  onChange={(e) => this.handleAnswerChange(e)}
                />
              </div>
            ) : null}
            {this.state.answeredQuestions == 4 ? (
              <div className="form-group">
                <textarea
                  classname="form-control"
                  name="question5"
                  placeholder="Your answer goes here"
                  value={this.state.diaryAnswers[this.state.answeredQuestions]}
                  onChange={(e) => this.handleAnswerChange(e)}
                />
              </div>
            ) : null}
          </form>
          <small class="form-text text-muted">
            {this.state.answeredQuestions + 1}/{this.state.totalDiaryQuestions}
          </small>
          {
            this.state.answeredQuestions > 0 ? 
            <>
              <button type="submit" className="btn startFormBtn mt-3 mr-2" onClick={()=> this.setState({answeredQuestions: this.state.answeredQuestions-1})}>
                  Prev
              </button>
              {" "}
            </>:null
          }
          {this.state.answeredQuestions < 4 ? (
            <>
              <button type="submit" className="btn startFormBtn mt-3" onClick={this.takeToNextStep}>
                Next
              </button>
            </>
          ) : (
            <>
              <button type="submit" className="btn startFormBtn mt-3" onClick={this.finishQuestions}>
                Finish
              </button>
            </>
          )}
        </div>
      );
    } else if (isSelectedDateInPrev7Days) {
      return (
        <div className="formBox">
          <div className="">
            <button className="btn startFormBtn" onClick={()=>this.setState({formStarted: true})}>Start Form</button>
          </div>
          <p className="startFormMsg">
            You have time until{" "}
            {moment(selectedDate)
              .add(7, "days")
              .subtract(1, "minutes")
              .format(DATE_FORMAT_WITH_TIME)}
            .
          </p>
          {/* <p className="startFormMsg">
            There is {" "}
            {`${dayDiff} days, ${hourDiff} hours, ${minDiff} minutes, ${secDiff} seconds`}
            {" "} left
          </p> */}
        </div>
      );
    } else if (isSelectedDateAfter7Days || isSelectedDateInNext7Days) {
      return (
        <div className="formBox">
          <p className="startFormMsg">Nothing here yet! </p>
          <p className="startFormMsg">
            Come back at{" "}
            <span className="text-theme-orange font-weight-bold">
              {moment(selectedDate).format(DATE_FORMAT_WITH_TIME)}
            </span>{" "}
            to fill out! You will have{" "}
            <span className="text-theme-orange font-weight-bold">7 days</span>{" "}
            after that.
          </p>
        </div>
      );
    } else {
      return (
        <div className="formBox">
          <p className="startFormMsg">You can't edit this now.</p>
        </div>
      );
    }
  };
  getMentalCalendar = () => {
    return (
      <div className="row customMargin p-3 questionsBox">
        <div className="col-sm-4">
          <MyCalendar
            selectedDate={this.state.selectedDate}
            handleDateChange={this.handleDateChange}
          />
        </div>
        <div className="col-sm-8">
          <div className="diary">
            <p className="selected_date">
              <span onClick={this.decreaseDateByOne} className="arrow_btns">
                <i className="fa fa-chevron-left mr-3"></i>
              </span>
              {moment(this.state.selectedDate).format(DATE_FORMAT)}
              <span onClick={this.increaseDateByOne} className="arrow_btns">
                <i className="fa fa-chevron-right ml-3"></i>
              </span>
            </p>
            {this.getFormBoxForMentalCalendar()}
          </div>
        </div>
      </div>
    );
  };
  getHeader = () => {
    return (
      <div className="row mt-5 reverse-col-flex">
        <div className="col-sm-8">
          <div className="userProfile">
            <div className="profileImg">
              <img
                src={this.state.user.information.avatar}
                className="img img-responsive"
              ></img>
            </div>
            <div className="profileDesc">
              <h3>{this.state.user.information.fullName}</h3>
              <p>"{this.state.user.information.tagline}"</p>
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="headerDesc">
            <ul className="list-group">
              {this.state.headerTabs.map((tab, idx) => {
                if (
                  tab.slug === "accounts" &&
                  this.state.user.information.systemRole === "member"
                ) {
                  return null;
                } else {
                  return (
                    <li
                      key={idx}
                      className={`list-group-item ${tab.status} ${
                        this.state.isHeaderToggleClicked ? "show" : "hide"
                      }`}
                      onClick={() => this.handleTabChange(idx)}
                    >
                      {tab.name}
                    </li>
                  );
                }
              })}
            </ul>
            <div className="headerToggle wrapper">
              <input
                type="checkbox"
                id="headerMenuToggler"
                className="input-toggler"
                checked={this.state.isHeaderToggleClicked}
              />
              <label
                htmlFor="headerMenuToggler"
                className="menu-toggler"
                onClick={this.toggleHeaderOptions}
              >
                <span className="menu-toggler__line"></span>
                <span className="menu-toggler__line"></span>
                <span className="menu-toggler__line"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };
  handleFileUploadChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const imgBase64 = await this.convertBase64(file);
    await this.props.updateUserImage(this.state.user._id, imgBase64);
    await this.props.loadUser();
    if (this.props.auth && this.props.auth.user) {
      this.setState({ user: this.props.auth.user });
    }
    if (this.props.userUpdated) {
      OCAlert.alertSuccess("Profile Image Updated Successfully :)", {
        timeOut: 3000,
      });
    } else {
      OCAlert.alertWarning("Could not edit profile image :(", {
        timeOut: 3000,
      });
    }
  };
  convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  uploadImage = () => {
    this.state.hiddenFileInputUpdateImage.current.click();
  };
  getUpdateImage = () => {
    return (
      <div className="row customMargin p-3 updateImage">
        <div className="col-sm-2">
          <div className="profileImg">
            <img
              src={this.state.user.information.avatar}
              className="img img-fluid"
            ></img>
          </div>
        </div>
        <div className="col-sm-10">
          <div className="diary">
            <div className="formBox">
              <div className="row">
                {/* On edit give upload image feature */}
                <div className="col-sm-3">
                  <div className="profileImg">
                    <img
                      src={this.state.user.information.avatar}
                      className="img"
                    ></img>
                  </div>
                  <button
                    className="btn startFormBtn"
                    onClick={this.uploadImage}
                  >
                    Edit
                  </button>
                  <input
                    type="file"
                    ref={this.state.hiddenFileInputUpdateImage}
                    onChange={this.handleFileUploadChange}
                    accept="image/jpeg,image/gif,image/jpg,image/png,image/x-eps"
                    style={{ display: "none" }}
                  />
                </div>
                <div className="col-sm-9">
                  <h2 className="text-theme-orange mt-3">
                    {this.state.user.information.fullName}
                  </h2>
                  <p className="startFormMsg">
                    {this.state.user.information.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  getAccounts = () => {
    return (
      <div className="row customMargin p-3 getAccounts">
        <div className="col-sm-2">
          {this.props.allUsers.map((user) => {
            return (
              <div className="profileImg left mt-3">
                <img
                  src={user.information.avatar}
                  className="img img-fluid"
                ></img>
              </div>
            );
          })}
        </div>
        <div className="col-sm-10">
          <div className="diary">
            <div className="formBox">
              <div className="row">
                {/* On edit give upload image feature */}
                <div className="col-sm-3">
                  <div className="profileImg">
                    <img
                      src={this.state.user.information.avatar}
                      className="img"
                    ></img>
                  </div>
                </div>
                <div className="col-sm-9">
                  <h2 className="text-theme-orange mt-3">
                    {this.state.user.information.fullName}
                  </h2>
                  <p className="startFormMsg">
                    {this.state.user.information.email}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <div className="accountEditBtnSection">
                    <button className="btn startFormBtn">Edit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  render() {
    if (this.state.user) {
      return (
        <>
          <MyLoader />
          <Alert />
          <OCAlertsProvider />
          <section className="dashboard">
            <div className="container">
              {this.getHeader()}
              {this.state.selectedTab === "mentalcalendar"
                ? this.getMentalCalendar()
                : null}
              {this.state.selectedTab === "updateimage"
                ? this.getUpdateImage()
                : null}
              {this.state.selectedTab === "accounts"
                ? this.getAccounts()
                : null}
            </div>
          </section>
        </>
      );
    } else {
      return <MyLoader />;
    }
  }
}

Dashboard.propTypes = {
  getAllUsers: PropTypes.func,
  logout: PropTypes.func,
  auth: PropTypes.object,
  loadUser: PropTypes.func,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  userUpdated: state.user.saved,
  allUsers: state.user.users,
});

export default connect(mapStateToProps, {
  logout,
  loadUser,
  updateUserImage,
  getAllUsers,
  saveDiaryAnswers
})(Dashboard);
