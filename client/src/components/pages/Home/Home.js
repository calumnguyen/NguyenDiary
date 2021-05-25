import React, { PureComponent } from "react";
import "./Home.css";
import ProfileCard from "./ProfileCard";
import { Magic } from "magic-sdk";

export class Home extends PureComponent {
  
  handleSignInRequest = async (values) => {
    const DID = await new Magic(
      process.env.NODE_ENV === "production"
        ? process.env.magic_api_key_publish
        : process.env.REACT_APP_magic_api_key_publish
    ).auth.loginWithMagicLink({ email: values.email });

    const authRequest = await fetch("/api/users/login", {
      wthCredentials: true,
      credentials: "same-origin",
      method: "POST",
      headers: { Authorization: `Bearer ${DID}` },
    });
    console.log(authRequest);
    if (authRequest.ok) {
      this.props.history.push("/dashboard");
    } else {
      console.log("Error in Client Authentication");
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
                <h3>Log In</h3>
                <p>
                  Choose your profile, and we will send you an email to login
                </p>
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
                <button
                  onClick={() =>
                    this.handleSignInRequest({ email: "tdivyanshu99@gmail.com" })
                  }
                >
                  Click me to test magic link, it will redirect to /dashboard
                </button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default Home;
