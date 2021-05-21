import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Loader = ({ auth, userLoading, articlesLoading, emailConfigLoading, wordsLoading, bugsLoading }) => {
  if(auth.loading || userLoading || articlesLoading || emailConfigLoading || wordsLoading || bugsLoading){
    return (
      <div className='loaderContainer'>
        <div className='loader'>
          <img
            src='/assets/logo-icon.gif'
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
};

const mapStateToProps = (state) => ({
  userLoading: state.user.loading,
  articlesLoading: state.articles.loading,
  emailConfigLoading: state.emailConfig.loading,
  wordsLoading: state.words.loading,
  bugsLoading: state.reportBug.loading,
  auth: state.auth,
});
export default connect(mapStateToProps)(Loader);
