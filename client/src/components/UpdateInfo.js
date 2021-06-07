import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { loadUser, logout } from "../actions/auth";
import {
  getAllUsers,
  updateUserImage,
  updateUser,
  getUser,
} from "../actions/user";
import { OCAlertsProvider } from "@opuscapita/react-alerts";
import { OCAlert } from "@opuscapita/react-alerts";

class Accounts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFullNameChange: false,
      isTaglineChange: false,
      isEmailChange: false,
      selectedUserId: null,
      selectedUser: null,
      hiddenFileInputUpdateImage: React.createRef(),
    };
  }
  async componentDidMount() {
    if (this.props.authUser) {
      this.setState({
        selectedUserId: this.props.authUser._id,
        selectedUser: this.props.authUser,
      });
    }
  }
  handleFileUploadChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const imgBase64 = await this.convertBase64(file);
    await this.props.updateUserImage(this.state.selectedUser._id, imgBase64);
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
  setSelectedUser = async (userId) => {
    await this.props.getUser(userId);
    this.setState({ selectedUser: this.props.fetchedUser });
  };
  handleUserInfoChange = (e) => {
    let modifiedUser = { ...this.state.selectedUser };
    modifiedUser.information[e.target.name] = e.target.value;
    this.setState({ selectedUser: modifiedUser });
  };
  updateUserInfo = async () => {
    await this.props.updateUser(this.state.selectedUser);
    if (this.props.userUpdated) {
      OCAlert.alertSuccess("Info Updated Successfully :)", {
        timeOut: 3000,
      });
      if (this.state.isFullNameChange) {
        this.setState({ isFullNameChange: !this.state.isFullNameChange });
      }
      if (this.state.isTaglineChange) {
        this.setState({ isTaglineChange: !this.state.isTaglineChange });
      }
      if (this.state.isEmailChange) {
        this.setState({ isEmailChange: !this.state.isEmailChange });
        if (this.props.authUser._id === this.state.selectedUser._id) {
          this.props.logout();
        }
      }
    } else {
      OCAlert.alertWarning("Could not save info :(", {
        timeOut: 3000,
      });
    }
  };
  render() {
    return (
      <div className="row customMargin p-3 updateImage">
        {this.state.selectedUser && (
          <div className="col-sm-2">
            <div className="profileImg">
              <img
                src={this.state.selectedUser.information.avatar}
                className="img img-fluid"
              ></img>
            </div>
          </div>
        )}
        {this.state.selectedUser ? (
          <div className="col-sm-10">
            <div className="diary">
              <div className="formBox">
                <div className="row">
                  {/* On edit give upload image feature */}
                  <div className="col-sm-3">
                    <div className="profileImg">
                      <img
                        src={this.state.selectedUser.information.avatar}
                        className="img"
                      ></img>
                    </div>
                    <button
                      className="btn startFormBtn"
                      onClick={this.uploadImage}
                    >
                      Edit <i className="fa fa-edit ml-2 cursor-pointer" />
                    </button>
                    <input
                      type="file"
                      ref={this.state.hiddenFileInputUpdateImage}
                      onChange={this.handleFileUploadChange}
                      accept="image/jpeg,image/gif,image/jpg,image/png,image/x-eps"
                      style={{ display: "none" }}
                    />
                  </div>
                  <div className="col-sm-9 userDetails">
                    {/* <h2 className="text-theme-orange mt-3 userName">
                      {this.state.selectedUser.information.fullName}
                      <i className="fa fa-edit ml-3 cursor-pointer" />
                    </h2> */}
                    <div className="form-group UserInfoEdit d-flex">
                      {this.state.isFullNameChange ? (
                        <>
                          <input
                            type="text"
                            name="fullName"
                            className="form-control editInfoInput"
                            value={this.state.selectedUser.information.fullName}
                            onChange={this.handleUserInfoChange}
                          />
                          <i
                            className="fa fa-check ml-3 cursor-pointer customTick"
                            onClick={this.updateUserInfo}
                          />
                        </>
                      ) : (
                        <h2 className="text-theme-orange mt-3 userName">
                          {this.state.selectedUser.information.fullName}
                          <i
                            className="fa fa-edit ml-3 cursor-pointer"
                            onClick={() =>
                              this.setState({
                                isFullNameChange: !this.state.isFullNameChange,
                              })
                            }
                          />
                        </h2>
                      )}
                    </div>
                    <div className="form-group UserInfoEdit d-flex">
                      {this.state.isEmailChange ? (
                        <>
                          <input
                            type="email"
                            name="email"
                            className="form-control editInfoInput"
                            value={this.state.selectedUser.information.email}
                            onChange={this.handleUserInfoChange}
                          />
                          <i
                            className="fa fa-check ml-3 cursor-pointer customTick"
                            onClick={this.updateUserInfo}
                          />
                        </>
                      ) : (
                        <p className="startFormMsg">
                          {this.state.selectedUser.information.email}
                        </p>
                      )}
                    </div>
                    {this.state.isTaglineChange &&
                      this.state.isEmailChange &&
                      this.state.isFullNameChange && (
                        <button
                          className="btn startFormBtn w-50"
                          onClick={this.updateUserInfo}
                        >
                          Save{" "}
                          <i className="fa fa-floppy-o ml-2 cursor-pointer" />
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

Accounts.propTypes = {
  getAllUsers: PropTypes.func,
  loadUser: PropTypes.func,
};

const mapStateToProps = (state) => ({
  userUpdated: state.user.saved ? state.user.saved : false,
  allUsers: state.user.users ? state.user.users : null,
  fetchedUser: state.user.user ? state.user.user : null,
});

export default connect(mapStateToProps, {
  loadUser,
  updateUserImage,
  getAllUsers,
  updateUser,
  getUser,
  logout,
})(Accounts);
