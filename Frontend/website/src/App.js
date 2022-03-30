import React from "react";
import "./App.css";
import NavBar from "./Components/NavBar";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import { BrowserRouter as Route, Router, Switch, Link } from "react-router-dom";
import History from "./History";
import { useState, useEffect } from "react";
import ChangePasswordPage from "./Pages/ChangePasswordPage";
import { AuthProvider } from "./Functions/Auth";

function App() {
  const [login, setLogin] = useState(false);

  const requestOptionsGet = {
    method: "GET",
    credentials: "include",
  };

  useEffect(() => {
    fetch("http://localhost:8002/auth", requestOptionsGet)
      .then((response) => response.json())
      .then((data) => {
        setLogin(data.loginStatus);
        console.log(data.loginStatus);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Router history={History}>
      <AuthProvider>
        <div className="App">
          <NavBar isLoggedIn={login} />
          <Switch>
            <Route exact path="/change_password">
              {" "}
              <ChangePasswordPage isLoggedIn={login} />{" "}
            </Route>
            <Route exact path="/register">
              {" "}
              <RegisterPage isLoggedIn={login} />{" "}
            </Route>
            <Route exact path="/login">
              {" "}
              <LoginPage isLoggedIn={login} setLogin={setLogin} />{" "}
            </Route>
            <Route exact path="/">
              {" "}
              <HomePage isLoggedIn={login} />{" "}
            </Route>
          </Switch>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
