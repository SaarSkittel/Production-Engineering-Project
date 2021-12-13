import React, { useState } from "react";
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
const ChangePasswordPage = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const classes = useStyle();
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
                    password: password
                  };
                  //POST REQUEST W/ DATA
                  const requestOptions = {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                  };
                  fetch("http://localhost:8002/change_password", requestOptions)
                    .catch((err) => {
                      console.log(err);
                    });
                }
              }}
            >
              Log in
            </Button>
          </Grid>
          <Typography variant="h6" className={classes.header} color="error">
            {error}
          </Typography>
        </Grid>
      </Paper>
    </Grid>
  );
};
export default ChangePasswordPage;
