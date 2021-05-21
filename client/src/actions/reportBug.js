import axios from "axios";
import {
  BUG_SAVING,
  REPORT_BUG_ERROR,
  REPORT_BUG_LOADING,
  BUG_SAVED,
  GET_BUGS,
  DELETE_BUG,
  REPORT_BUG_POPUP_STATUS,
  REPORT_BUG_IMG_SRC,
} from "./types";
import { setAlert } from "./alert";

// Save a new bug in dictionary
export const saveBug = (bugBody) => async (dispatch) => {
  dispatch({ type: REPORT_BUG_LOADING });
  dispatch({ type: BUG_SAVING });
  const config = {
    headers: {
      "content-type": "application/json",
    },
  };

  try {
    const res = await axios.post("/api/reportbug/add", bugBody, config);
    dispatch({
      type: BUG_SAVED,
      payload: res.data,
    });
    // dispatch(setAlert(res.data.msg, "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: REPORT_BUG_ERROR,
    });
  }
};

//get all bugs
export const getBugs = (pageNo) => async (dispatch) => {
  dispatch({ type: REPORT_BUG_LOADING });
  try {
    const res = await axios.get(`/api/reportbug/getbugs/${pageNo}`);
    if (res.data) {
      dispatch({
        type: GET_BUGS,
        payload: res.data,
      });
    }
  } catch (err) {
    dispatch({
      type: REPORT_BUG_ERROR,
      payload: err.response,
    });
  }
};


//delete bug
export const deleteBug = (bugId) => async (dispatch) => {
  dispatch({ type: REPORT_BUG_LOADING });
  try {
    const res = await axios.post(`/api/reportbug/delete`, { bugId });
    if (res.data) {
      dispatch({
        type: DELETE_BUG,
        payload: res.data,
      });
    }
  } catch (err) {
    dispatch({
      type: REPORT_BUG_ERROR,
      payload: err.response,
    });
  }
};

//set popup status
export const setPopupStatus = (status) => async (dispatch) => {
  dispatch({ type: REPORT_BUG_LOADING });
  try {
    dispatch({
      type: REPORT_BUG_POPUP_STATUS,
      payload: status,
    });
  } catch (err) {
    dispatch({
      type: REPORT_BUG_ERROR,
      payload: err.response,
    });
  }
};

//set img src
export const setImgSrc = (imgSrc) => async (dispatch) => {
  dispatch({ type: REPORT_BUG_LOADING });
  try {
    dispatch({
      type: REPORT_BUG_IMG_SRC,
      payload: imgSrc,
    });
  } catch (err) {
    dispatch({
      type: REPORT_BUG_ERROR,
      payload: err.response,
    });
  }
};

