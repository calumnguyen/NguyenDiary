import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { logout } from '../actions/auth';

import { updateUser } from '../actions/user';

import { OCAlertsProvider } from '@opuscapita/react-alerts';
import { OCAlert } from '@opuscapita/react-alerts';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFullNameChange: false,
      isTaglineChange: false,
      headerTabs: [
        {
          name: 'Ghi Chú Cảm Xúc',
          status: 'active',
          slug: 'mentalcalendar',
        },
        {
          name: 'Tài Khoản',
          status: 'inactive',
          slug: 'updateinfo',
        },
        {
          name: 'Admin',
          status: 'inactive',
          slug: 'accounts',
        },
        {
          name: 'Đăng Xuất',
          status: 'inactive',
          slug: 'logout',
        },
      ],
      isHeaderToggleClicked: false,
      selectedTab: 'mentalcalendar',
      isTaglineChange: false,
      selectedUser: null,
    };
  }
  componentDidMount() {
    if (this.props.authUser) {
      this.setState({ selectedUser: this.props.authUser });
    }
  }
  handleLogOutRequest = () => {
    this.props.logout();
  };

  handleUserInfoChange = (e) => {
    let modifiedUser = { ...this.state.selectedUser };
    modifiedUser.information[e.target.name] = e.target.value;
    this.setState({ selectedUser: modifiedUser });
  };
  updateUserInfo = async () => {
    await this.props.updateUser(this.state.selectedUser);
    if (this.props.userUpdated) {
      this.props.loadAndSetAuthUser();
      if (this.state.isTaglineChange) {
        this.setState({ isTaglineChange: !this.state.isTaglineChange });
      }
    } else {
      OCAlert.alertWarning('Could not save tagline :(', {
        timeOut: 3000,
      });
    }
  };

  handleTabChange = (idx) => {
    let updatedHeaderTabs = [...this.state.headerTabs];
    updatedHeaderTabs.forEach((tab) => (tab.status = 'inactive'));
    updatedHeaderTabs[idx].status = 'active';
    let currentTab = updatedHeaderTabs[idx];
    updatedHeaderTabs.splice(idx, 1);
    updatedHeaderTabs.unshift(currentTab);

    this.setState({
      headerTabs: updatedHeaderTabs,
      isHeaderToggleClicked: !this.state.isHeaderToggleClicked,
      selectedTab: currentTab.slug,
    });
    this.props.handleSelectedTabChange(currentTab.slug);
    if (currentTab.slug === 'logout') {
      this.handleLogOutRequest();
    }
  };
  toggleHeaderOptions = () => {
    this.setState({ isHeaderToggleClicked: !this.state.isHeaderToggleClicked });
  };
  render() {
    if (this.props.authUser) {
      return (
        <div className='row mt-5 reverse-col-flex Header'>
          <div className='col-sm-8'>
            <div className='userProfile'>
              <div className='profileImg'>
                <img
                  src={this.props.authUser.information.avatar}
                  className='img img-responsive'
                ></img>
              </div>
              <div className='profileDesc'>
                <h3>{this.props.authUser.information.fullName}</h3>
                <div className='form-group UserInfoEdit d-flex'>
                  {this.state.isTaglineChange ? (
                    <>
                      <input
                        type='text'
                        name='tagline'
                        className='form-control editInfoInput'
                        value={this.state.selectedUser.information.tagline}
                        onChange={this.handleUserInfoChange}
                        onBlur={this.updateUserInfo}
                        autoFocus
                      />
                    </>
                  ) : (
                    <p className='text-muted'>
                      "{this.props.authUser.information.tagline}"
                      <i
                        className='fa fa-edit ml-3 cursor-pointer'
                        onClick={() =>
                          this.setState({
                            isTaglineChange: !this.state.isTaglineChange,
                          })
                        }
                      />
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className='col-sm-4'>
            <div className='headerDesc'>
              <ul className='list-group'>
                {this.state.headerTabs.map((tab, idx) => {
                  if (
                    tab.slug === 'accounts' &&
                    this.props.authUser.information.systemRole === 'member'
                  ) {
                    return null;
                  } else {
                    return (
                      <li
                        key={idx}
                        className={`list-group-item ${tab.status} ${
                          this.state.isHeaderToggleClicked ? 'show' : 'hide'
                        }`}
                        onClick={() => this.handleTabChange(idx)}
                      >
                        {tab.name}
                      </li>
                    );
                  }
                })}
              </ul>
              <div className='headerToggle wrapper'>
                <input
                  type='checkbox'
                  id='headerMenuToggler'
                  className='input-toggler'
                  checked={this.state.isHeaderToggleClicked}
                />
                <label
                  htmlFor='headerMenuToggler'
                  className='menu-toggler'
                  onClick={this.toggleHeaderOptions}
                >
                  <span className='menu-toggler__line'></span>
                  <span className='menu-toggler__line'></span>
                  <span className='menu-toggler__line'></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

Header.propTypes = {
  logout: PropTypes.func,
  updateUser: PropTypes.func,
};

const mapStateToProps = (state) => ({
  userUpdated: state.user.saved ? state.user.saved : false,
});

export default connect(mapStateToProps, {
  logout,
  updateUser,
})(Header);
