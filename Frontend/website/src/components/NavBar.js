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

const NavBar = () => {
  const classes = useStyle();
  return (
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
        <Button color="inherit" position="absolute"onClick={() => History.push("/login")}>
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
};
export default NavBar;
