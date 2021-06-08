import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import ImgLogo from '../../assets/img/default_profile_pics/others.png';
import MyLoader from '../layout/MyLoader';

class Error extends Component {
  state = {
    redirect: false,
  };

  render() {
    const { auth } = this.props;
    if (!auth.loading && !auth.isAuthenticated) {
      return <Redirect to='/' />;
    }
    if (this.state.redirect) {
      return <Redirect to='/dashboard' />;
    }

    return (
      <React.Fragment>
        <MyLoader />
        <div className='wrapper menu-collapsed'>
          <div className='main-panel'>
            {/* <div className='main-content'> */}
            {/* <div className='content-wrapper'> */}
            <section id='error'>
              <div className='container-fluid forgot-password-bg overflow-hidden'>
                <div className='row full-height-vh'>
                  <div className='col-12 d-flex align-items-center justify-content-center vertical-align-center'>
                    <div className='row'>
                      <div className='col-sm-12 text-center'>
                        {/* <img
                          src={ImgLogo}
                          alt=""
                          className="img-fluid maintenance-img mb-2"
                          height="250"
                          width="300"
                        /> */}
                        <h3 className='text-theme-white mb-5 mt-4'>
                          Đâm đầu vào ngõ cụt.
                        </h3>

                        <button className='btn btn-theme-orange btn-lg mt-3'>
                          {/* <a
                            href="/dashboard"
                            className="text-decoration-none text-white"
                          >
                            <i className="ft-external-link"></i> Back to
                            dashboard
                          </a> */}
                          <Link
                            to='/dashboard'
                            className='text-decoration-none text-white'
                          >
                            <i className='ft-external-link'></i> Quay Lại
                          </Link>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* </div> */}
            {/* </div> */}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Error.propTypes = {
  auth: PropTypes.object,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(Error);
