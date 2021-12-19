import { useState } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemIcon from "@mui/material/ListItemIcon";
import InfoIcon from "@mui/icons-material/Info";
import { makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyle = makeStyles((theme) => ({
  color: {
    color: "#fff",
  },
  background: {
    backgroundColor: "#000",
  },
  list: {
    width: 250,
    backgroundColor: "#000",
    height: "100%",
  },
}));
export default function Drawer(props) {
  const classes = useStyle();
  const [open, setOpen] = useState(false);
  const ChangePasswordLink = (props) => (
    <Link to="/change_password" {...props} />
  );

  if (props.isLoggedIn) {
    return (
      <div>
        <IconButton edge="start" color="inherit" onClick={() => setOpen(true)}>
          <MenuIcon />
        </IconButton>
        <SwipeableDrawer
          anchor="left"
          color="primary"
          open={open}
          onClose={() => setOpen(false)}
        >
          <div className={classes.list}>
            <List>
              <ListItem
                button
                component={ChangePasswordLink}
                onClick={() => setOpen(false)}
              >
                <ListItemIcon>
                  <InfoIcon className={classes.color} />
                </ListItemIcon>
                <ListItemText
                  className={classes.color}
                  primary="Change Password"
                />
              </ListItem>
            </List>
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
  return (
    <div>
      <IconButton edge="start" color="inherit" onClick={() => setOpen(true)}>
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer
        anchor="left"
        color="primary"
        open={open}
        onClose={() => setOpen(false)}
      >
        <div className={classes.list}>
          <List>
            <ListItem>
              <ListItemIcon>
                <InfoIcon className={classes.color} />
              </ListItemIcon>
              <ListItemText className={classes.color} primary="About Me" />
            </ListItem>
          </List>
        </div>
      </SwipeableDrawer>
    </div>
  );
}
