import axios from "axios";
import {
  USER_LOADING,
  USER_SAVED,
  USER_ERROR,
  GET_USERS,
  GET_USER,
  USERS_ERROR,
  USERS_LOADING,
  USER_DELETED,
  USER_UPDATED,
  DIARY_UPDATED,
  GET_DIARY_ANSWERS,
  GET_ALL_DIARY_DATES
} from "./types";
import { setAlert } from "./alert";

// Add new user
export const addNewUser = (user) => async (dispatch) => {
  dispatch({ type: USER_LOADING });

  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };

  try {
    const res = await axios.post("/api/users/add", user, config);
    dispatch({
      type: USER_SAVED,
      payload: res.data,
    });

    dispatch(setAlert(res.data.msg, "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: USER_ERROR,
    });
  }
};

// get All Users
export const getAllUsers = () => async (dispatch) => {
  dispatch({ type: USER_LOADING });
  try {
    const res = await axios.get(`/api/users`);
    if (res.data) {
      dispatch({
        type: GET_USERS,
        payload: res.data.allUsers,
      });
    }
  } catch (err) {
    dispatch({
      type: USERS_ERROR,
      payload: err.response,
    });
  }
};

// Find user
export const findUsers = (searchVal) => async (dispatch) => {
  dispatch({ type: USER_LOADING });
  try {
    const res = await axios.get(`/api/users/search/${searchVal}`);

    dispatch({
      type: GET_USERS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: USERS_ERROR,
      payload: err.response,
    });
  }
};

// Get User by ID
export const getUser = (id) => async (dispatch) => {
  dispatch({ type: USERS_LOADING });

  try {
    const res = await axios.get(`/api/users/${id}`);
    dispatch({
      type: GET_USER,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: USERS_ERROR,
      payload: err.response,
    });
  }
};

// Update User
export const updateUser = (user, id) => async (dispatch) => {
  dispatch({ type: USERS_LOADING });
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };

  try {
    const res = await axios.post(`/api/users/${id}`, user, config);

    dispatch({
      type: USER_UPDATED,
      payload: res.data,
    });
    dispatch(setAlert(res.data.msg, "success"));
    dispatch(getAllUsers());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: USERS_ERROR,
    });
  }
};

//update profile image
export const updateUserImage = (userId, updatedImage) => async (dispatch) => {
  dispatch({ type: USER_LOADING });
  const config = {
    headers: {
      "content-type": "application/json",
    },
  };
  try {
    const res = await axios.post(`/api/users/edit-image`, {userId, updatedImage}, config);

    dispatch({
      type: USER_UPDATED,
      payload: res.data,
    });
    // dispatch(setAlert(res.data.msg, "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: USERS_ERROR,
    });
  }
};

//Save Diary Answers
export const saveDiaryAnswers = (userId, diaryObj) => async (dispatch) => {
  dispatch({ type: USER_LOADING });
  const config = {
    headers: {
      "content-type": "application/json",
    },
  };
  // Dairy obj should have day, ans1, ans2, ans3, ans4, ans5
  try {
    const res = await axios.post(`/api/users/update-diary`, {userId, ...diaryObj}, config);
    dispatch({
      type: DIARY_UPDATED,
      payload: res.data,
    });
    // dispatch(setAlert(res.data.msg, "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: USERS_ERROR,
    });
  }
};

//Get Diary Answers by given day
export const getDiaryAnswers = (userId, day) => async (dispatch) => {
  dispatch({ type: USER_LOADING });
  const config = {
    headers: {
      "content-type": "application/json",
    },
  };
  try {
    const res = await axios.get(`/api/users/get-diary/${userId}/${day}`, config);
    dispatch({
      type: GET_DIARY_ANSWERS,
      payload: res.data,
    });
    // dispatch(setAlert(res.data.msg, "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: USERS_ERROR,
    });
  }
};


//Get All diary dates for a given UserId
export const getAllDiaryDates = (userId) => async (dispatch) => {
  dispatch({ type: USER_LOADING });
  const config = {
    headers: {
      "content-type": "application/json",
    },
  };
  try {
    const res = await axios.get(`/api/users/get-diary-dates/${userId}`, config);
    dispatch({
      type: GET_ALL_DIARY_DATES,
      payload: res.data,
    });
    // dispatch(setAlert(res.data.msg, "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: USERS_ERROR,
    });
  }
};
