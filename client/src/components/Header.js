import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { logout } from "../actions/auth";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFullNameChange: false,
      isTaglineChange: false,
      headerTabs: [
        {
          name: "Mental Calendar",
          status: "active",
          slug: "mentalcalendar",
        },
        {
          name: "Update Info",
          status: "inactive",
          slug: "updateinfo",
        },
        {
          name: "Accounts",
          status: "inactive",
          slug: "accounts",
        },
        {
          name: "Logout",
          status: "inactive",
          slug: "logout",
        },
      ],
      isHeaderToggleClicked: false,
      selectedTab: "mentalcalendar",
    };
  }
  componentDidMount() {}
  handleLogOutRequest = () => {
    this.props.logout();
  };
  handleTabChange = (idx) => {
    let updatedHeaderTabs = [...this.state.headerTabs];
    updatedHeaderTabs.forEach((tab) => (tab.status = "inactive"));
    updatedHeaderTabs[idx].status = "active";
    let currentTab = updatedHeaderTabs[idx];
    updatedHeaderTabs.splice(idx, 1);
    updatedHeaderTabs.unshift(currentTab);

    this.setState({
      headerTabs: updatedHeaderTabs,
      isHeaderToggleClicked: !this.state.isHeaderToggleClicked,
      selectedTab: currentTab.slug,
    });
    this.props.handleSelectedTabChange(currentTab.slug);
    if (currentTab.slug === "logout") {
      this.handleLogOutRequest();
    }
  };
  toggleHeaderOptions = () => {
    this.setState({ isHeaderToggleClicked: !this.state.isHeaderToggleClicked });
  };
  render() {
      if(this.props.authUser){
        return (
            <div className="row mt-5 reverse-col-flex">
              <div className="col-sm-8">
                <div className="userProfile">
                  <div className="profileImg">
                    <img
                      src={this.props.authUser.information.avatar}
                      className="img img-responsive"
                    ></img>
                  </div>
                  <div className="profileDesc">
                    <h3>{this.props.authUser.information.fullName}</h3>
                    <p>"{this.props.authUser.information.tagline}"</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="headerDesc">
                  <ul className="list-group">
                    {this.state.headerTabs.map((tab, idx) => {
                      if (
                        tab.slug === "accounts" &&
                        this.props.authUser.information.systemRole === "member"
                      ) {
                        return null;
                      } else {
                        return (
                          <li
                            key={idx}
                            className={`list-group-item ${tab.status} ${
                              this.state.isHeaderToggleClicked ? "show" : "hide"
                            }`}
                            onClick={() => this.handleTabChange(idx)}
                          >
                            {tab.name}
                          </li>
                        );
                      }
                    })}
                  </ul>
                  <div className="headerToggle wrapper">
                    <input
                      type="checkbox"
                      id="headerMenuToggler"
                      className="input-toggler"
                      checked={this.state.isHeaderToggleClicked}
                    />
                    <label
                      htmlFor="headerMenuToggler"
                      className="menu-toggler"
                      onClick={this.toggleHeaderOptions}
                    >
                      <span className="menu-toggler__line"></span>
                      <span className="menu-toggler__line"></span>
                      <span className="menu-toggler__line"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          );
      }
    else{
        return null;
    }
  }
}

Header.propTypes = {
  logout: PropTypes.func
};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {
  logout
})(Header);
