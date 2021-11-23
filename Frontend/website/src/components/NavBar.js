import React from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { makeStyles } from '@material-ui/core';
import Drawer  from './Drawer';

const useStyle = makeStyles((theme)=>({
    appBar:{
      backgroundColor: "#000",
    },
    text:{
      color: "#fff"
    }
  }));

const NavBar=()=>{
    const classes=useStyle();
    return (
        <AppBar position="static">
        <Toolbar className={classes.appBar} variant="dense">
          <Drawer/>
          <Typography  variant="h6"  color="common.white">
            Saar Skittel
          </Typography>
        </Toolbar>
      </AppBar>
    );
}
export default NavBar