import React, { useState } from "react";
import { Button, Grid, makeStyles, Paper, TextField, Typography } from "@material-ui/core";
const useStyle = makeStyles((theme) => ({
    paper:{
        padding:"30px 20px",
        width:300,
        margin:"20px auto",
    
    },
    header:{
        marginBottom:"30px"
    },
    text_fields:{
        marginBottom:"20px"
    }
}));
const LoginPage = () => {
  const [userName, setUserName]=useState("");
  const [password, setPassword]=useState("");
  const [error,setError]=useState("");
  const classes = useStyle();
  return( 
    <Grid>
        <Paper className={classes.paper} elevation={20}>
            <Grid direction={'column'} spacing={24}>
                <Typography variant="h2"className={classes.header}>
                    Login
                </Typography>
                <Grid>
                    <TextField className={classes.text_fields} label="User Name" variant="filled" required value={userName} onChange={e=>setUserName(e.target.value)}/>
                    <TextField className={classes.text_fields} label="Password" variant="filled" type="password" required value={password} onChange={e=>setPassword(e.target.value)}/>
                    <Button type="Login" variant="contained" color="primary" onClick={
                        ()=>{
                            if(!userName||!password){
                                setError("Missing user name or/and password.")
                            }
                            else{
                                //CREATE A REQUEST TO SERVER FOR LOGIN 
                                const data = {
                                    userName: userName,
                                    password: password
                                  };
                                  //GET REQUEST W/ DATA
                                const requestOptions = {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(data),
                                };
                                fetch("http://localhost:8001/login", requestOptions)
                                .then((response) => response.json())
                                .then((dataRes) => {
                                    //CHECK IF RESPONSE FROM SERVERS
                                    console.log(dataRes);
                                    //GO TO THE ONE PAGE BACK
                                })
                                .catch((err) => {
                                  console.log(err);
                                });
                                //SEND TOKEN IF INFORMATION IS CORRECT

                                //SEND ERROR IF INFORMATION IS NOT CORRECT OR USER DOES NOT EXSIST
                            }
                        }}>
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
export default LoginPage;