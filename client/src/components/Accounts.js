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
      selectedUserId: null,
      selectedUser: null,
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
  setSelectedUser = async (userId) => {
    await this.props.getUser(userId);
    this.setState({ selectedUser: this.props.fetchedUser });
  };
  render() {
    return (
      <div className="row customMargin p-3 getAccounts">
        <div className="col-sm-2 profileThumbnailImg">
          {this.props.allUsers &&
            this.props.allUsers.map((user) => {
              return (
                <div
                  className="profileImg left mt-3"
                  onClick={() => this.setSelectedUser(user._id)}
                >
                  <img
                    src={user.information.avatar}
                    className="img img-fluid"
                  ></img>
                </div>
              );
            })}
        </div>
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
                  </div>
                  <div className="col-sm-9">
                    <h2 className="text-theme-orange mt-3">
                      {this.state.selectedUser.information.fullName}
                    </h2>
                    <p className="startFormMsg">
                      {this.state.selectedUser.information.email}
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
})(Accounts);
