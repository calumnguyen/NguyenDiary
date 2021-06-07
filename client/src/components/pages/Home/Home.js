import React, { PureComponent } from "react";
import "./Home.scss";
import ProfileCard from "./ProfileCard";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Alert from "../../layout/Alert";
import MyLoader from "../../layout/MyLoader";

// import { confirmAlert } from 'react-confirm-alert';
// import 'react-confirm-alert/src/react-confirm-alert.css';

import { OCAlertsProvider } from "@opuscapita/react-alerts";
import { OCAlert } from "@opuscapita/react-alerts";

// Actions
import { getAllUsers } from "../../../actions/user";
import { login, loadUser } from "../../../actions/auth";

export class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      allUsers: [],
    };
  }
  componentDidMount() {
    this.props.loadUser();
  }
  handleSignInRequest = async (values) => {
    await this.props.login(values);
    if (this.props.isAuthenticated) {
      this.props.history.push("/dashboard");
    } else {
      OCAlert.alertWarning("Could not log you in :(", {
        timeOut: 3000,
      });
    }
  };

  async componentDidMount() {
    await this.props.getAllUsers();
    this.setState({ allUsers: this.props.allUsers });
  }

  allProfiles = () => {
    let profiles = [];
    if (this.state.allUsers && this.state.allUsers.length > 0) {
      profiles = this.state.allUsers.map((profile, idx) => {
        return (
          <ProfileCard
            key={profile.information.username}
            profile={profile}
            handleSignInRequest={this.handleSignInRequest}
            key={idx}
          />
        );
      });
    }
    return profiles;
  };

  render() {
    return (
      <>
        <MyLoader />
        <OCAlertsProvider />
        {this.props.isAuthenticated && <Redirect to="/dashboard" />}
        <section className="home">
          <div className="container-fluid">
            <div className="introDesc">
              <h3>Log In</h3>
              <p>Choose your profile, and we will send you an email to login</p>
            </div>
            <div className="d-flex profiles">{this.allProfiles()}</div>
          </div>
        </section>
      </>
    );
  }
}

Home.propTypes = {
  getAllUsers: PropTypes.func,
  loadUser: PropTypes.func,
  login: PropTypes.func,
};

const mapStateToProps = (state) => ({
  allUsers: state.user.users,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { getAllUsers, login, loadUser })(Home);
