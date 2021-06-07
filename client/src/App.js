import React from "react";
import {
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import "./global.css";

//middlewares
import setAuthToken from "./utils/setAuthToken";
import PrivateRoute from "./routing/PrivateRoute";

// Redux
import { Provider } from "react-redux";
import store from "./store";

//custom components
import Home from "./components/pages/Home/Home";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import Error from "./components/pages/Error";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          {/* <Route exact path="/Login" component={Login} /> */}

          {/* Dashboard */}
          <PrivateRoute exact path="/dashboard" component={Dashboard} />

          {/* users */}
          <PrivateRoute exact path="/Error" component={Error} />

          <Route path="*" component={Error} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
