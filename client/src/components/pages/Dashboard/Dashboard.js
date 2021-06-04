import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import { logout } from "../../../actions/auth";
import "./Dashboard.css";
import MyCalendar from "./MyCalendar";
import MyImg from "../../../assets/img/default_profile_pics/male.png";

const DATE_FORMAT = "DD/MM/YYYY";

export class Dashboard extends Component {
  static propTypes = {};
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
    };
  }
  handleDateChange = (changedDate) => {
    this.setState({ selectedDate: changedDate });
  };
  handleLogOutRequest = async () => {
    await this.props.logout();
    if (!this.props.token) {
      this.props.history.push("/");
    }
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
    return (
      <>
        {/* Redirect to /dashboard is auth cookies is set */}
        <section className="dashboard">
          <div className="container">
            <div className="row mt-5">
              <div className="col-sm-8">
                <div className="userProfile">
                  <div className="profileImg">
                    <img src={MyImg} className="img img-responsive w-100"></img>
                  </div>
                  <div className="profileDesc">
                    <h3>Priyanshu Tiwari</h3>
                    <p>"Arise, Awake and Stop Not, till the goal is reached"</p>
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
                    <label htmlFor="headerMenuToggler" className="menu-toggler">
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
                        .format(DATE_FORMAT)}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}

Dashboard.propTypes = {
  logout: PropTypes.func,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  token: state.auth.token,
});

export default connect(mapStateToProps, { logout })(Dashboard);
