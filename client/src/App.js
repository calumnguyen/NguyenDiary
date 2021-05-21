import React, { useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  withRouter,
} from "react-router-dom";
import './global.css';
import setAuthToken from "./utils/setAuthToken";
import PrivateRoute from "./routing/PrivateRoute";

// Redux
import { Provider } from "react-redux";
import store from "./store";
import Home from './components/pages/Home/Home';

function App() {
  return (
    <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          {/* <Route exact path="/Login" component={Login} /> */}

          {/* Dashboard */}
          {/* <PrivateRoute exact path="/dashboard" component={Dashboard} /> */}

          {/* users */}
          {/* <PrivateRoute exact path="/user/adduser" component={AddUser} />
          <PrivateRoute exact path="/Error" component={Error} /> */}
        </Switch>
      </Router>
  );
}

export default App;
