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
  LOGOUT_FAIL,
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
  try {
    dispatch({
      type: AUTH_LOADING,
    })
    //Get magic Link DID token
    const DID = await new Magic(
      MAGIC_LINK_PUBLIC_KEY
    ).auth.loginWithMagicLink({ email: values.email });
  
    //set DID token in local storage for using it later
    localStorage.setItem("DIDToken", DID);  
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      wthCredentials: true,
      credentials: "same-origin",
      method: "POST",
      headers: { Authorization: `Bearer ${DID}` }
    }
    const res = await axios.post('/api/auth', {}, config)
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    })
    //dispatch(loadUser())
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload:err
    })
  }
}

// Logout / clear profile
export const logout = () => async (dispatch) => {
  //take the same DID and pass it to Server and take response from there
  const DID = localStorage.getItem("DIDToken");
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
    const res = await axios.post('/api/auth/logout', {}, config)
    dispatch({
      type: LOGOUT
    })
  } catch (err) {
    dispatch({
      type: LOGOUT_FAIL,
      payload:err.response.data
    })
  }
}
