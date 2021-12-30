import React, { useState, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useHistory } from "react-router-dom";
import { Button, makeStyles } from "@material-ui/core";
import Drawer from "./Drawer";
import { Redirect } from "react-router-dom";
import Auth from "../Functions/Auth";

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

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
  let { isLoggedIn, logout } = useContext(Auth);
  const forceUpdate = useForceUpdate();
  let history = useHistory();

  return (
    <div>
      {isLoggedIn ? (
        <AppBar position="static">
          <Toolbar className={classes.appBar} variant="dense">
            <Drawer isLoggedIn={props.isLoggedIn} />
            <Typography variant="h6" color="common.white" component="div">
              Saar Skittel
            </Typography>
            <Button
              color="inherit"
              position="absolute"
              onClick={() => {
                logout();
              }}
            >
              Logout
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
              onClick={() => history.push("/register")}
            >
              Register
            </Button>
            <Button
              color="inherit"
              position="absolute"
              onClick={() => history.push("/login")}
            >
              Login
            </Button>
          </Toolbar>
        </AppBar>
      )}
    </div>
  );
};
export default NavBar;
