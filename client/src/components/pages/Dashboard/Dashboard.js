import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import { Redirect } from "react-router-dom";

import "./Dashboard.css";
import MyCalendar from "./MyCalendar";
import MyImg from "../../../assets/img/default_profile_pics/male.png";
import { loadUser, logout } from "../../../actions/auth";
import MyLoader from "../../layout/MyLoader";
import { OCAlertsProvider } from "@opuscapita/react-alerts";
import { OCAlert } from "@opuscapita/react-alerts";
import Alert from "../../layout/Alert";

const DATE_FORMAT = "DD/MM/YYYY";

export class Dashboard extends Component {
  static propTypes = {};
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
      user: null,
    };
  }
  async componentDidMount() {
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
  render() {
    if (this.state.user) {
      return (
        <>
          <MyLoader />
          <Alert />
          <OCAlertsProvider />
          <section className="dashboard">
            <div className="container">
              <div className="row mt-5">
                <div className="col-sm-8">
                  <div className="userProfile">
                    <div className="profileImg">
                      <img
                        src={MyImg}
                        className="img img-responsive w-100"
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
                    <h2>Mental Calendar</h2>
                    <div className="headerToggle wrapper">
                      <input
                        type="checkbox"
                        id="headerMenuToggler"
                        className="input-toggler"
                      />
                      <label
                        htmlFor="headerMenuToggler"
                        className="menu-toggler"
                      >
                        <span className="menu-toggler__line"></span>
                        <span className="menu-toggler__line"></span>
                        <span className="menu-toggler__line"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row customMargin">
                <div className="col-sm-4">
                  <MyCalendar
                    selectedDate={this.state.selectedDate}
                    handleDateChange={this.handleDateChange}
                  />
                </div>
                <div className="col-sm-8">
                  <div className="diary">
                    <p className="selected_date">
                      <span
                        onClick={this.decreaseDateByOne}
                        className="arrow_btns"
                      >
                        <i className="fa fa-chevron-left mr-3"></i>
                      </span>
                      {moment(this.state.selectedDate).format(DATE_FORMAT)}
                      <span
                        onClick={this.increaseDateByOne}
                        className="arrow_btns"
                      >
                        <i className="fa fa-chevron-right ml-3"></i>
                      </span>
                    </p>
                    <div className="formBox">
                      <div className="">
                        <button className="btn startFormBtn">Start Form</button>
                      </div>
                      <p className="startFormMsg">
                        You have time until 8:00pm{" "}
                        {moment(this.state.selectedDate)
                          .add(7, "days")
                          .format(DATE_FORMAT)}
                        .
                      </p>
                      <button
                        className="btn btn-secondary"
                        onClick={this.handleLogOutRequest}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
  logout: PropTypes.func,
  auth: PropTypes.object,
  loadUser: PropTypes.func,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  token: state.auth.token,
  auth: state.auth,
});

export default connect(mapStateToProps, { logout, loadUser })(Dashboard);
