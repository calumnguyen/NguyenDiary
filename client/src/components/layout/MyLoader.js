import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import LogoImg from "../../assets/loading-img.gif";
import "./myLoader.css";
const MyLoader = ({ auth, userLoading }) => {
  if (auth.loading || userLoading) {
    return (
      <div>
        <div class="spinner">
          <div class="double-bounce1"></div>
          <div class="double-bounce2"></div>
        </div>
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
  auth: state.auth.loading,
});
export default connect(mapStateToProps)(MyLoader);
