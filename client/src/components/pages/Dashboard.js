import React, { Component } from 'react';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';
import Loader from '../layout/Loader';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import '../../login.css';
import '../../dashbaord.css';
import { Redirect } from 'react-router-dom';
import signatureGIF from '../../assets/img/calum-one-loop.gif';

class Dashboard extends Component {
  async componentDidMount() {
    return;
  }

  render() {
    const { user } = this.props.auth;
    return (
      <React.Fragment>
        <Loader />
        <div className='wrapper menu-collapsed'>
          <Sidebar location={this.props.location}></Sidebar>
          <Header></Header>

          <div className='main-panel'>
            <div className='main-content'>
              <div className='content-wrapper'>
                <div className='row signatureCard'>
                  <h2 className='ml-2 text-bold-400'>
                    {user && user.fullname && `${user.fullname}`}, bạn đây rồi!
                  </h2>
                  <br />
                  <p className='ml-2 mt-3 dashboardBody'>
                    Người Thông Dịch đã ngóng đợi bạn từ bao ngày nay. Cảm ơn
                    bạn đã góp sức vào cuộc chiến bảo vệ sự thật, lẽ phải, công
                    lý và quyền bình đẳng cùng với Người Thông Dịch.
                  </p>
                  <p className='ml-2 mt-3 dashboardBody'>
                    Chân thành cảm ơn bạn đã đứng vững bên cùng với đội đặc
                    nhiệm Người Thông Dịch!
                  </p>
                  <div className='row dashboardMessageFooter'>
                    <div className='col-sm-12'>
                      <p className='ml-2'>Sincerely,</p>
                      <img
                        src={signatureGIF}
                        className='img img-responsive dashboardSignImage'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <footer className='footer footer-static footer-light'>
              <p className='clearfix text-muted text-sm-center px-2'>
                <span>
                  Copyright &nbsp;{' '}
                  <a
                    href='https://www.sutygon.com'
                    id='pixinventLink'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-bold-800 primary darken-2'
                  >
                    SUTYGON-BOT{' '}
                  </a>
                  , All rights reserved.{' '}
                </span>
              </p>
            </footer>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object,
};

const mapStateToProps = (state) => ({
  users: state.user.users,
  auth: state.auth,
});
export default connect(mapStateToProps, {})(Dashboard);
