import React, { PureComponent } from "react";
import "./Home.css";
import ProfileCard from "./ProfileCard";

export class Home extends PureComponent {
  render() {
    return (
      <section className="home">
        <div className="container">
          <div className="col-sm-12">
            <div className="intro">
              <h3>Log In</h3>
              <p>Choose your profile, and we will send you an email to login</p>
            </div>

            <div className="row profiles">
              <div className="col-sm-3">
                <ProfileCard />
              </div>
              <div className="col-sm-3">
                <ProfileCard />
              </div>
              <div className="col-sm-3">
                <ProfileCard />
              </div>
              <div className="col-sm-3">
                <ProfileCard />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Home;
