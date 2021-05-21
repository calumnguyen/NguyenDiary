import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import loadjs from "loadjs";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import Modal from "react-awesome-modal";

import { OCAlertsProvider } from "@opuscapita/react-alerts";
import { OCAlert } from "@opuscapita/react-alerts";
import Alert from "./Alert";
import { saveBug, setPopupStatus } from "../../actions/reportBug";
import { setAlert } from "../../actions/alert";

import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
class Header extends Component {
  state = {
    username: "",
    userType: "",
    id: "",
    avatar: "",
    dropdownOpen: false,
    showReportBugModal: false,
    bugTitle: "",
    imgSrc: "",
    bugComment: "",
    titleMissing: false,
  };

  componentDidMount() {
    loadjs(`/assets/vendors/js/core/jquery-3.2.1.min.js`);
    loadjs(`/assets/vendors/js/core/popper.min.js`);
    loadjs(`/assets/vendors/js/core/bootstrap.min.js`);
    loadjs(`/assets/vendors/js/perfect-scrollbar.jquery.min.js`);
    loadjs(`/assets/vendors/js/prism.min.js`);
    loadjs(`/assets/vendors/js/jquery.matchHeight-min.js`);
    loadjs(`/assets/vendors/js/screenfull.min.js`);
    loadjs(`/assets/vendors/js/pace/pace.min.js`);
    loadjs(`/assets/js/app-sidebar.js`);
    loadjs(`/assets/js/notification-sidebar.js`);
    loadjs(`/assets/js/customizer.js`);
    loadjs(`/assets/js/view_product.js`);
    const { user } = this.props.auth;
    if (user != undefined) {
      this.setState({
        username: user.username,
        userType: user.type,
        id: user._id,
        avatar: user.avatar,
      });
    }
  }
  setDropdownOpen = (e) => {
    e.preventDefault();
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  };

  closeReportBugModal = () => {
    this.setState({
      showReportBugModal: false,
      bugTitle: "",
      bugComment: "",
      imgSrc: "",
      titleMissing: false,
    });
    this.props.setPopupStatus(false);
  };
  openReportBugModal = () => {
    const screenshotTarget = document.body;
    html2canvas(screenshotTarget).then((canvas) => {
      const base64image = canvas.toDataURL("image/png");
      this.setState({ imgSrc: base64image });
    });
    this.setState({
      showReportBugModal: true,
    });
  };
  reportBug = async () => {
    if (!this.state.bugTitle) {
      this.setState({ titleMissing: true });
      return;
    }
    let bugBody = {
      title: this.state.bugTitle,
      imgSrc: this.props.imgSrc,
      comment: this.state.bugComment,
      submittedBy: {
        userId: this.props.auth.user._id
          ? this.props.auth.user._id
          : this.state.id,
        fullName: this.props.auth.user.fullname
          ? this.props.auth.user.fullname
          : this.state.username,
      },
    };
    await this.props.saveBug(bugBody);
    if (this.props.bugSaved) {
      this.closeReportBugModal();
      OCAlert.alertSuccess("Bug reported successfully", { timeOut: 2000 });
      this.setState({ bugTitle: "", bugComment: "", imgSrc: "" });
    } else {
      this.closeReportBugModal();
      OCAlert.alertError("Bug could not be reported", {
        timeOut: 3000,
      });
      this.setState({ bugTitle: "", bugComment: "", imgSrc: "" });
    }
  };
  _handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "bugTitle" && e.target.value.length > 0) {
      this.setState({ titleMissing: false });
    }
  };
  render() {
    const { user } = this.props.auth;
    return (
      <>
        {user && user.avatar ? (
          <ButtonDropdown
            isOpen={this.state.dropdownOpen}
            toggle={(e) => this.setDropdownOpen(e)}
            style={{ float: "right", marginTop: "10px" }}
          >
            <DropdownToggle caret color="white">
              <img
                style={{ height: "40px" }}
                src={user && user.avatar && user && user.avatar}
                alt={"User"}
              />
              {user && user.username && user && user.username}
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                {" "}
                <Link
                  to={this.state.id ? `/user/edituser/${this.state.id}` : ""}
                  className="dropdown-item py-1"
                >
                  <i className="ft-edit mr-2"></i>
                  <span>Edit Profile</span>
                </Link>
              </DropdownItem>
              {user && user.systemRole === "Admin" ? (
                <DropdownItem>
                  {" "}
                  <Link to="/email-config" className="dropdown-item py-1">
                    <i className="ft-mail mr-2"></i>
                    <span>Email Config</span>
                  </Link>
                </DropdownItem>
              ) : null}

              <DropdownItem>
                <Link
                  to="/"
                  onClick={() => this.props.logout()}
                  className="dropdown-item"
                >
                  <i className="ft-power mr-2"></i>
                  <span>Logout</span>
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        ) : (
          ""
        )}
        {/* <button
          className="btn btn-primary pull-right mt-3 mr-4"
          onClick={this.openReportBugModal}
        >
          <i className="fa fa-bug mr-2"></i> <span>Report Bug</span>
        </button> */}
        <Modal
          visible={this.props.showPopup}
          width="600"
          height="650"
          effect="fadeInUp"
          onClickAway={(e) => this.closeReportBugModal(e)}
        >
          <Alert />
          <OCAlertsProvider />
          <div>
            <div className="modal-header">
              <h3>Report Bug</h3>
            </div>
            <div className="modal-body">
              <div className="form-group row">
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control border-primary"
                    placeholder="Enter Bug title here"
                    name="bugTitle"
                    value={this.state.bugTitle}
                    onChange={(e) => this._handleChange(e)}
                  />
                </div>
              </div>
              <div className="form-group row">
                <div className="col-md-12">
                  <img
                    src={this.props.imgSrc}
                    className="img w-100"
                    height="300px"
                  />
                </div>
              </div>
              <div className="form-group row">
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control border-primary"
                    placeholder="Comments"
                    name="bugComment"
                    value={this.state.bugComment}
                    onChange={(e) => this._handleChange(e)}
                  />
                </div>
              </div>
              <div className="form-group row">
                <div className="col-md-12">
                  {this.state.titleMissing ? (
                    <p className="alert alert-warning mb-0">
                      Please enter title
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {this.props.savingBug ? (
                <button
                  type="button"
                  className="mb-2 mr-2 btn grey btn-lg btn-outline-success"
                >
                  <div
                    className="spinner-grow spinner-grow-sm "
                    role="status"
                  ></div>{" "}
                  &nbsp; Submitting Bug{" "}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={this.reportBug}
                  className="mb-2 mr-2 btn grey btn-lg btn-outline-success"
                >
                  Submit Bug{" "}
                  <i className="fa fa-paper-plane ml-1" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={(e) => this.closeReportBugModal(e)}
                className="btn grey btn-lg btn-outline-danger"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

Header.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object,
  saveBug: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  bugSaved: state.reportBug.saved,
  savingBug: state.reportBug.savingBug,
  showPopup: state.reportBug.showPopup,
  imgSrc: state.reportBug.imgSrc
});

export default connect(mapStateToProps, {
  logout,
  saveBug,
  setAlert,
  setPopupStatus,
})(Header);
