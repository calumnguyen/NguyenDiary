import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LogoImg from '../../assets/logo.png';

const Loader = ({ auth, userLoading }) => {
  if(auth.loading || userLoading){
    return (
      <div className='loaderContainer'>
        <div className='loader'>
          <img
            src={LogoImg}
            alt='Loader'
            className='loader-img'
            width='100'
          />
          <div className='ball-grid-pulse'>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    );
  } else{
    return null;
  }
}
  // if page is loading show loader
  


Loader.propTypes = {
  authLoading: PropTypes.bool,
  userLoading: PropTypes.bool
};

const mapStateToProps = (state) => ({
  userLoading: state.user.loading,
  auth: state.auth.loading,
});
export default connect(mapStateToProps)(Loader);
