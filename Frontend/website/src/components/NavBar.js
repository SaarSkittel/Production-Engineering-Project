import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import History from "../History";
import { Button, makeStyles } from "@material-ui/core";
import Drawer from "./Drawer";
const useStyle = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "#000",
  },
  text: {
    color: "#fff",
  },
}));

const NavBar = (props) => {
  const classes = useStyle();
  const requestOptionsDelete = {
    method: "DELETE",
    credentials: "include",
  };

  return (
    <div>
      {!props.isLoggedIn ? (
        <AppBar position="static">
          <Toolbar className={classes.appBar} variant="dense">
            <Drawer />
            <Typography variant="h6" color="common.white" component="div">
              Saar Skittel
            </Typography>
            <Button
              color="inherit"
              position="absolute"
              onClick={() => History.push("/register")}
            >
              Register
            </Button>
            <Button
              color="inherit"
              position="absolute"
              onClick={() => History.push("/login")}
            >
              Login
            </Button>
          </Toolbar>
        </AppBar>
      ) : (
        <AppBar position="static">
          <Toolbar className={classes.appBar} variant="dense">
            <Drawer />
            <Typography variant="h6" color="common.white" component="div">
              Saar Skittel
            </Typography>
            <Button
              color="inherit"
              position="absolute"
              onClick={() => {
                fetch("http://localhost:8002/logout", requestOptionsDelete)
                  .then((response) => response.json())
                  .then((dataRes) => {
                    //CHECK IF RESPONSE FROM SERVERS
                    console.log(dataRes);
                    //GO TO HOME PAGE AND CLEAR HISTORY
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      )}
    </div>
  );
};
export default NavBar;
