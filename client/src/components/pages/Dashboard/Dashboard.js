import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import { Redirect } from "react-router-dom";

import "./Dashboard.scss";
import MyCalendar from "./MyCalendar";
import { loadUser, logout } from "../../../actions/auth";
import { updateUserImage } from "../../../actions/user";
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
          name: "Logout",
          status: "inactive",
          slug: "logout",
        },
      ],
      isHeaderToggleClicked: false,
      selectedTab: "mentalcalendar",
      hiddenFileInputUpdateImage : React.createRef()
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
  handleTabChange = (idx) => {
    let updatedHeaderTabs = [...this.state.headerTabs];
    updatedHeaderTabs.forEach((tab) => (tab.status = "inactive"));
    updatedHeaderTabs[idx].status = "active";
    this.setState({
      headerTabs: updatedHeaderTabs,
      isHeaderToggleClicked: !this.state.isHeaderToggleClicked,
      selectedTab: updatedHeaderTabs[idx].slug,
    });
    if (updatedHeaderTabs[idx].slug === "logout") {
      this.handleLogOutRequest();
    }
  };
  toggleHeaderOptions = () => {
    this.setState({ isHeaderToggleClicked: !this.state.isHeaderToggleClicked });
  };
  getMentalCalendar = () => {
    return (
      <div className="row customMargin p-3">
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
            </div>
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
    if(!file) return;
    const imgBase64 = await this.convertBase64(file);
    await this.props.updateUserImage(this.state.user._id, imgBase64);
    await this.props.loadUser();
    if (this.props.auth && this.props.auth.user) {
      this.setState({ user: this.props.auth.user });
    }
    if(this.props.userUpdated){
      OCAlert.alertSuccess("Profile Image Updated Successfully :)", {
        timeOut: 3000,
      });
    } else{
      OCAlert.alertWarning("Could not edit profile image :(", {
        timeOut: 3000,
      });
    }
  };
  convertBase64 = (file) =>{
    return new Promise((resolve,reject)=>{
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = ()=>{
        resolve(fileReader.result);
      }
      fileReader.onerror=(error)=>{
        reject(error);
      }
    })
  }
  uploadImage = () => {
    this.state.hiddenFileInputUpdateImage.current.click();
  }
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
                  <button className="btn startFormBtn" onClick={this.uploadImage}>Edit</button>
                  <input
                    type="file"
                    ref={this.state.hiddenFileInputUpdateImage}
                    onChange={this.handleFileUploadChange}
                    accept='image/jpeg,image/gif,image/jpg,image/png,image/x-eps'
                    style={{display: 'none'}}
                  />
                </div>
                <div className="col-sm-9">
                  <h2 className="text-theme-orange mt-3">{this.state.user.information.fullName}</h2>
                  <p className="startFormMsg">{this.state.user.information.email}</p>
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
          <Alert/>
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
  auth: state.auth,
  userUpdated: state.user.saved
});

export default connect(mapStateToProps, { logout, loadUser,updateUserImage })(Dashboard);
