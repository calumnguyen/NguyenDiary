import axios from "axios";
import {
  EMAIL_CONFIG_ERROR,
  EMAIL_CONFIG_SAVED,
  EMAIL_CONFIG_LOADING,
  GET_EMAIL_CONFIG,
  EMAIL_CONFIG_SAVING
} from "./types";
import { setAlert } from "./alert";

// Save email Configuration
export const saveEmailConfiguration = (emailConfig) => async (dispatch) => {
  dispatch({ type: EMAIL_CONFIG_LOADING });
  dispatch({ type: EMAIL_CONFIG_SAVING });
  const config = {
    headers: {
      "content-type": "application/json",
    },
  };

  try {
    const res = await axios.post("/api/emailconfig/save", emailConfig, config);
    dispatch({
      type: EMAIL_CONFIG_SAVED,
      payload: res.data,
    });
    //dispatch(setAlert(res.data.msg, "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: EMAIL_CONFIG_ERROR,
    });
  }
};

// get email configuration
export const getEmailConfiguration = () => async (dispatch) => {
  dispatch({ type: EMAIL_CONFIG_LOADING });
  try {
    const res = await axios.get(`/api/emailconfig`);
    if (res.data) {
      dispatch({
        type: GET_EMAIL_CONFIG,
        payload: res.data,
      });
    }
  } catch (err) {
    dispatch({
      type: EMAIL_CONFIG_ERROR,
      payload: err.response,
    });
  }
};
