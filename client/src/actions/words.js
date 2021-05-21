import axios from "axios";
import {
  GET_WORDS,
  GET_WORD,
  WORDS_ERROR,
  WORDS_LOADING,
  WORD_SAVING,
  WORD_SAVED,
  GET_UNSUBMITTED_WORDS_COUNT,
  GET_FOUND_WORDS,
  DELETE_WORD
} from "./types";
import { setAlert } from "./alert";

// Save a new word in dictionary
export const saveWord = (wordBody) => async (dispatch) => {
  dispatch({ type: WORDS_LOADING });
  dispatch({ type: WORD_SAVING });
  const config = {
    headers: {
      "content-type": "application/json",
    },
  };

  try {
    const res = await axios.post("/api/words/add", wordBody, config);
    dispatch({
      type: WORD_SAVED,
      payload: res.data,
    });
    //dispatch(setAlert(res.data.msg, "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: WORDS_ERROR,
    });
  }
};

// Update exisiting word in dictionary
export const updateWord = (wordBody) => async (dispatch) => {
  dispatch({ type: WORDS_LOADING });
  dispatch({ type: WORD_SAVING });
  const config = {
    headers: {
      "content-type": "application/json",
    },
  };

  try {
    const res = await axios.post("/api/words/update", wordBody, config);
    dispatch({
      type: WORD_SAVED,
      payload: res.data,
    });
    //dispatch(setAlert(res.data.msg, "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: WORDS_ERROR,
    });
  }
};

// get unsubmitted words count
export const getWordsCount = () => async (dispatch) => {
  dispatch({ type: WORDS_LOADING });
  try {
    const res = await axios.get(`/api/words/count`);
    if (res.data) {
      dispatch({
        type: GET_UNSUBMITTED_WORDS_COUNT,
        payload: res.data,
      });
    }
  } catch (err) {
    dispatch({
      type: WORDS_ERROR,
      payload: err.response,
    });
  }
};

//get all words whose status is unsubmitted
export const getWords = (pageNo) => async (dispatch) => {
  dispatch({type: WORDS_LOADING});
  try{
    const res = await axios.get(`/api/words/getwords/${pageNo}`);
    if (res.data) {
      dispatch({
        type: GET_WORDS,
        payload: res.data,
      });
    }
  } catch(err){
    dispatch({
      type: WORDS_ERROR,
      payload: err.response,
    });
  }
}

//get word whose status is unsubmitted by wordId
export const getWord = (wordId) => async (dispatch) => {
  dispatch({type: WORDS_LOADING});
  try{
    const res = await axios.get(`/api/words/getword/${wordId}`);
    if (res.data) {
      dispatch({
        type: GET_WORD,
        payload: res.data,
      });
    }
  } catch(err){
    dispatch({
      type: WORDS_ERROR,
      payload: err.response,
    });
  }
}

//find all words and their translation from the dictionary
export const findWords = (searchVal) => async (dispatch) => {
  dispatch({type: WORDS_LOADING});
  try{
    const res = await axios.get(`/api/words/findwords/${searchVal}`);
    if (res.data) {
      dispatch({
        type: GET_FOUND_WORDS,
        payload: res.data,
      });
    }
  } catch(err){
    dispatch({
      type: WORDS_ERROR,
      payload: err.response,
    });
  }
}


//delete word from the dictionary
export const deleteWord = (wordId) => async (dispatch) => {
  dispatch({type: WORDS_LOADING});
  try{
    const res = await axios.post(`/api/words/delete`, {wordId});
    if (res.data) {
      dispatch({
        type: DELETE_WORD,
        payload: res.data,
      });
    }
  } catch(err){
    dispatch({
      type: WORDS_ERROR,
      payload: err.response,
    });
  }
}