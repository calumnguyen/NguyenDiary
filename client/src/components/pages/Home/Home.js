import React, { PureComponent } from "react";
import "./Home.css";

class Profile extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col-sm-12"></div>
      </div>
    );
  }
}

export class Home extends PureComponent {
  render() {
    return (
      <section className="home">
        <div className="row">
          <div className="col-sm-12">
            <h3>Log In</h3>
            <p>Choose your profile, and we will send you an email to login</p>
            <p>Work in progress...</p>
          </div>
        </div>
      </section>
    );
  }
}

export default Home;
