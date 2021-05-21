import { combineReducers } from 'redux';
import auth from './auth';
import alert from './alert';
import pages from './pages';

export default combineReducers({
  alert,
  auth,
  pages
});
