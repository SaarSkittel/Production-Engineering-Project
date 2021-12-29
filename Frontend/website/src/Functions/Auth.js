import { createContext, useState, useEffect } from "react";

const Auth = createContext();

export default Auth;

export const AuthProvider = ({ children }) => {
  let [isLoggedIn, setLogin] = useState(false);
  let [accessToken, setAccessToken] = useState();
  let [loading, setLoading] = useState(true);
  let [userName, setUserName] = useState();
  let [userTable, setUserTable] = useState();

  let requestOptionsToken = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let requestOptionsUserName =(token) =>{ return( {
    method: "GET",
    credentials: "include",
    headers: { Authorization: "Bearer " + token },
  });}

  let requestOptionsUserTable =(token)=> { return({
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })};

let getUserName = (token) => {
    fetch("http://localhost:8002/", requestOptionsUserName(token))
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUserName(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

let getUserTable=(token) => {
    fetch("http://localhost:8002/users", requestOptionsUserTable(token))
      .then((response) => response.json())
      .then((data) => {
        setUserTable(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };


  let updateAccessToken = () => {
    fetch("http://localhost:8002/token", requestOptionsToken)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.AccessToken);
        setAccessToken(data.AccessToken);
        setLogin(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    updateAccessToken();
    let interval = setInterval(() => {
      console.log("interval start");
        updateAccessToken();
    }, 3540000);
    return () => {
      clearInterval(interval);
    };
  }, [accessToken, loading]);


  let contextData = {
    setAccessToken: setAccessToken,
    setLogin: setLogin,
    accessToken: accessToken,
    isLoggedIn: isLoggedIn,
    updateAccessToken: updateAccessToken,
    getUserTable:getUserTable,
    getUserName:getUserName,
    userName:userName,
    userTable:userTable
  };
  return <Auth.Provider value={contextData}>{children}</Auth.Provider>;
};
