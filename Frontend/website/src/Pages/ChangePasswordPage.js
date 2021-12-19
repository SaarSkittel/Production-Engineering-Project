import React, { useState } from "react";
import {Redirect} from "react-router-dom";
import {
  Button,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
const useStyle = makeStyles((theme) => ({
  paper: {
    padding: "30px 20px",
    width: 300,
    margin: "20px auto",
  },
  header: {
    marginBottom: "30px",
  },
  text_fields: {
    marginBottom: "20px",
  },
}));
const ChangePasswordPage = (props) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const classes = useStyle();
  if (props.isLoggedIn) {
    return (
      <Grid>
        <Paper className={classes.paper} elevation={20}>
          <Grid direction={"column"} spacing={24}>
            <Typography variant="h2" className={classes.header}>
              Change Password
            </Typography>
            <Grid>
              <TextField
                className={classes.text_fields}
                label="Password"
                variant="filled"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                className={classes.text_fields}
                label="Password Confirmation"
                variant="filled"
                required
                type="password"
                onChange={(e) => {
                  //CHECK IF BOTH PASSWORDS ARE THE SAME
                  if (e.target.value === password) {
                    setError("");
                    setPasswordConfirmation(true);
                  } else {
                    setError("Passwords are not matching");
                    setPasswordConfirmation(false);
                  }
                }}
              />
              <Button
                type="register"
                variant="contained"
                color="primary"
                onClick={() => {
                  if (!error) {
                    setError("");
                    //INFORMATION TO BE SENT TO SERVERS
                    const data = {
                      //ADD TOKEN
                      password: password,
                    };
                    //POST REQUEST W/ DATA
                    const requestOptions = {
                      method: "Post",
                      headers: { "Content-Type": "application/json" },
                      credentials: 'include',
                      body: JSON.stringify(data),
                    };
                    fetch(
                      "http://localhost:8002/change_password",
                      requestOptions
                    ).catch((err) => {
                      console.log(err);
                    });
                  }
                }}
              >
                Change Password
              </Button>
            </Grid>
            <Typography variant="h6" className={classes.header} color="error">
              {error}
            </Typography>
          </Grid>
        </Paper>
      </Grid>
    );
  } else {
    return <Redirect to="/" />;
  }
};
export default ChangePasswordPage;
