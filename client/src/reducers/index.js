import { combineReducers } from 'redux';
import auth from './auth';
import alert from './alert';
import pages from './pages';
import user from './user';

export default combineReducers({
  alert,
  auth,
  pages,
  user
});
