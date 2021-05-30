// @access  Private
import axios from 'axios'
import {MAGIC_LINK_PUBLIC_KEY} from '../utils/constants';
import { Magic } from "magic-sdk";

import {
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  AUTH_LOADING,
} from './types'
import { setAlert } from './alert'
import setAuthToken from '../utils/setAuthToken'

// Load user
export const loadUser = () => async (dispatch) => {
  dispatch({
    type: AUTH_LOADING,
  })
  if (localStorage.token) {
    setAuthToken(localStorage.token)
  }

  try {
    const res = await axios.get('/api/auth')
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    })
  }
}

// Login
export const login = (values) => async (dispatch) => {
  dispatch({
    type: AUTH_LOADING,
  })
  
  const DID = await new Magic(
    MAGIC_LINK_PUBLIC_KEY
  ).auth.loginWithMagicLink({ email: values.email });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    wthCredentials: true,
    credentials: "same-origin",
    method: "POST",
    headers: { Authorization: `Bearer ${DID}` }
  }

  try {
    const res = await axios.post('/api/auth', {}, config)
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    })
    //dispatch(loadUser())
  } catch (err) {
    if (err.response) {
      const errors = err.response.data.errors
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
      }
    }
    dispatch({
      type: LOGIN_FAIL,
      payload:err.response.data
    })
  }
}

// Logout / clear profile
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT })
}
