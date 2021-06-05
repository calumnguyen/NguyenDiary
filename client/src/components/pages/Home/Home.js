import React, { PureComponent } from "react";
import "./Home.css";
import ProfileCard from "./ProfileCard";
import { Magic } from "magic-sdk";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import Alert from "../../layout/Alert";
import Loader from "../../layout/Loader";
import MyLoader from "../../layout/MyLoader";
import { MAGIC_LINK_PUBLIC_KEY } from "../../../utils/constants";

// import { confirmAlert } from 'react-confirm-alert';
// import 'react-confirm-alert/src/react-confirm-alert.css';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
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
      profiles = this.state.allUsers.map((profile,idx) => {
        return (
          <div className="col-sm-3" key={idx}>
            <ProfileCard
              key={profile.information.username}
              profile={profile}
              handleSignInRequest={this.handleSignInRequest}
            />
          </div>
        );
      });
    }
    return profiles;
  };

  render() {
    return (
      <>
        <MyLoader />
        {/* <Alert /> */}
        <OCAlertsProvider />
        {
          (this.props.isAuthenticated) && <Redirect to="/dashboard"/>
        }
        <section className="home">
          <div className="container">
            <div className="col-sm-12">
              <div className="intro">
                <h3>Log In</h3>
                <p>
                  Choose your profile, and we will send you an email to login
                </p>
              </div>
              <div className="row profiles">{this.allProfiles()}</div>
            </div>
          </div>
        </section>
      </>
    );
  }
}

Home.propTypes = {
  getAllUsers: PropTypes.func,
  loadUser: PropTypes.func,
  login: PropTypes.func
};

const mapStateToProps = (state) => ({
  allUsers: state.user.users,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { getAllUsers, login, loadUser })(Home);
