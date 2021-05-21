import axios from "axios";
import {
    ARTICLES_LOADING,
    ARTICLE_SAVED,
    ARTICLES_ERROR,
    GET_ARTICLES,
    GET_ARTICLE,
    GET_ARTICLES_BY_PAGE_NO,
    DELETE_ARTICLE
} from "./types";
import { setAlert } from "./alert";

// Add new article
export const addArticle = (article) => async (dispatch) => {
  dispatch({ type: ARTICLES_LOADING });
  const config = {
    headers: {
      "content-type": "application/json",
    },
  };

  try {
    const res = await axios.post("/api/articles/add", article, config);
    dispatch({
      type: ARTICLE_SAVED,
      payload: res.data,
    });
    //dispatch(setAlert(res.data.msg, "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: ARTICLES_ERROR,
    });
  }
};

// Update existing article
export const updateArticle = (article,articleId) => async (dispatch) => {
  dispatch({ type: ARTICLES_LOADING });
  const config = {
    headers: {
      "content-type": "application/json",
    },
  };

  try {
    const res = await axios.put(`/api/articles/update/${articleId}`, article, config);
    dispatch({
      type: ARTICLE_SAVED,
      payload: res.data,
    });
    //dispatch(setAlert(res.data.msg, "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: ARTICLES_ERROR,
    });
  }
};

// Autosave article
export const autoSaveArticle = (article,articleId) => async (dispatch) => {
  const config = {
    headers: {
      "content-type": "application/json",
    },
  };

  try {
    const res = await axios.put(`/api/articles/update/${articleId}`, article, config);
    dispatch({
      type: ARTICLE_SAVED,
      payload: res.data,
    });
    //dispatch(setAlert(res.data.msg, "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: ARTICLES_ERROR,
    });
  }
};

// get All Articles
export const getAllArticles = () => async (dispatch) => {
  dispatch({ type: ARTICLES_LOADING });
  try {
    const res = await axios.get(`/api/articles`);
    if (res.data) {
      dispatch({
        type: GET_ARTICLES,
        payload: res.data,
      });
    }
  } catch (err) {
    dispatch({
      type: ARTICLES_ERROR,
      payload: err.response,
    });
  }
};

//GET article by ID
export const getArticle = (artcileId) => async (dispatch) => {
  dispatch({ type: ARTICLES_LOADING });
  try {
    const res = await axios.get(`/api/articles/${artcileId}`);
    if (res.data) {
      dispatch({
        type: GET_ARTICLE,
        payload: res.data,
      });
    }
  } catch (err) {
    dispatch({
      type: ARTICLES_ERROR,
      payload: err.response,
    });
  }
};

//Get articles by page no.
export const getAllArticlesByPageNo = (page, selectedTab) => async (dispatch) => {
  dispatch({ type: ARTICLES_LOADING });
  try {
    const currentPage = page || 1;
    const res = await axios.post(`/api/articles/`,{currentPage:currentPage, selectedTab: selectedTab});
    dispatch({
      type: GET_ARTICLES_BY_PAGE_NO,
      payload: {
        articles: res.data.articles,
        total: res.data.total,
      },
    });
  } catch (err) {
    dispatch({
      type: ARTICLES_ERROR,
      payload: err.response,
    });
  }
};

//Delete Article by ArticleId.
export const deleteArticleById = (articleId) => async (dispatch) => {
  dispatch({ type: ARTICLES_LOADING });
  try {
    const res = await axios.post(`/api/articles/delete`,{articleId: articleId});
    dispatch({
      type: DELETE_ARTICLE,
      payload: res.data.msg
    });
  } catch (err) {
    dispatch({
      type: ARTICLES_ERROR,
      payload: err.response,
    });
  }
};