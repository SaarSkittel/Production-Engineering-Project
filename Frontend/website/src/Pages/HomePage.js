import React from "react";
import { useState, useEffect, useContext } from "react";
import { makeStyles, Typography } from "@material-ui/core";
import UserTable from "../Components/UserTable";
import ReactDOM from "react-dom";
import Auth from "../Functions/Auth";

const useStyle = makeStyles((theme) => {});

const HomePage = (props) => {
  const classes = useStyle();

  const [tableData, setTableData] = useState();
  let { accessToken, getUserTable, getUserName, userTable, userName } =
    useContext(Auth);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    getUserTable(accessToken);
    let interval = setInterval(() => {
      getUserTable(accessToken);
    }, 300000);
    return () => {
      clearInterval(interval);
    };
  }, [accessToken]);

  //300000 ms

  useEffect(() => {
    getUserName(accessToken);
    let interval = setInterval(() => {
      getUserName(accessToken);
    }, 300000);
    return () => {
      clearInterval(interval);
    };
  }, [accessToken]);

  return (
    <div>
      {accessToken ? (
        <Typography>{accessToken}</Typography>
      ) : (
        <Typography>null</Typography>
      )}
      {!userName ? (
        <Typography>Loading...</Typography>
      ) : (
        <Typography>{userName}</Typography>
      )}
      {!userTable ? (
        <Typography>Not logged in</Typography>
      ) : (
        <UserTable userList={userTable} />
      )}
      <div>
        <video id="videoPlayer" width="650" controls>
          <source src="http://localhost:8002/video" type="video/mp4" />
        </video>
      </div>
    </div>
  );
};
export default HomePage;
