import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "./MyLoader.css";

const MyLoader = ({ authLoading, userLoading }) => {
  if (authLoading || userLoading) {
    return (
      <div className="spinner">
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
    );
  } else {
    return null;
  }
};
// if page is loading show loader

MyLoader.propTypes = {
  authLoading: PropTypes.bool,
  userLoading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  userLoading: state.user.loading,
  authLoading: state.auth.loading,
});
export default connect(mapStateToProps)(MyLoader);
