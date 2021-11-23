import React from "react";
import logo from "./logo.svg";
import "./App.css";
import NavBar from "./Components/NavBar";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from"./Pages/RegisterPage";
import { BrowserRouter as Route, Router, Switch, Link } from "react-router-dom";
import History from "./History";
function App() {

  return (
    <Router history={History}>
      <div className="App">
        <NavBar />
        <div>
          <Switch>
            <Route exact path="/register"> <RegisterPage/> </Route>
            <Route exact path="/login"> <LoginPage/> </Route>
            <Route exact path="/"> <HomePage /> </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
