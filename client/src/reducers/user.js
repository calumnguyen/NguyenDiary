import {
  USER_LOADING,
  USER_DELETED,
  GET_USER,
  USERS_ERROR,
  USER_UPDATED,
  USER_SAVED,
  GET_USERS,
  GET_DIARY_ANSWERS,
  DIARY_UPDATED,
  GET_ALL_DIARY_DATES
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  profile: null,
  users: null,
  loading: false,
  error: {},
  saved: false,
  user: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADING:
      return {
        ...state,
        loading: true,
        saved: false,
      };
    case GET_USERS:
      return {
        ...state,
        users: payload,
        loading: false,
        saved: false,
      };
    case GET_USER:
      return {
        ...state,
        ...payload,
        loading: false,
        saved: false,
      };
    case GET_DIARY_ANSWERS:
      return {
        ...state,
        ...payload,
        loading: false,
        saved: false,
      };
    case GET_ALL_DIARY_DATES:
      return {
        ...state,
        ...payload,
        loading: false,
        saved: false,
      };
    case USER_SAVED:
      return {
        ...state,
        user: payload,
        saved: true,
        loading: false,
      };

    case USERS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        saved: false,
        diarySaved: false,
      };

    case USER_UPDATED:
      return {
        ...state,
        loading: false,
        saved: true,
      };
    case DIARY_UPDATED:
      return {
        ...state,
        loading: false,
        diarySaved: true,
      };
    case USER_DELETED:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
