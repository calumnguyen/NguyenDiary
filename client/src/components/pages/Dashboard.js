import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Home/Home.css";
export class Dashboard extends Component {
  static propTypes = {};
  handleLogOutRequest = () => {
    console.log("You are logged out");
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

export default Dashboard;
