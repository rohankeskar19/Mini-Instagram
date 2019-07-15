import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Dashboard from "./components/dashboard/Dashboard";

import HomePage from "./components/HomePage";

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path="/" component={HomePage} exact />
            <Route path="/dashboard" component={Dashboard} exact />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
