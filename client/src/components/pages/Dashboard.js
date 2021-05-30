import React, { Component } from "react";
import "./Home/Home.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  logout
} from "../../actions/auth";
import { times } from "lodash";

export class Dashboard extends Component {
  static propTypes = {};
  constructor(props){
    super(props);
  }
  handleLogOutRequest = async () => {
    await this.props.logout();
    if(!this.props.token){
      this.props.history.push('/');
    }
  };
  render() {
    return (
      <>
        {/* Redirect to /dashboard is auth cookies is set */}
        <section className="home">
          <div className="container">
            <div className="col-sm-12">
              <div className="intro">
                <h3>Logged In</h3>
                <p>
                  Welcome to MentalCalendar
                  <br/>
                  <button className="btn btn-secondary mt-5" onClick={() => this.handleLogOutRequest()}>
                    Logout
                  </button>
                </p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}

Dashboard.propTypes = {
  logout: PropTypes.func
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  token: state.auth.token
});

export default connect(mapStateToProps, { logout })(Dashboard);
