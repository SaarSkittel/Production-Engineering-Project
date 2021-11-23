import React from "react";
import { useState } from "react";
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

const RegisterPage = () => {
  const classes = useStyle();
  const [userName,setUserName]= useState("");
  const [fullName,setFullName]= useState("");
  const [password,setPassword]= useState("");
  const [passwordConfirmation,setPasswordConfirmation]= useState("");
  const [error,setError]= useState("");

  return (
    <Grid>
        <Paper className={classes.paper} elevation={20}>
            <Grid>
                <Typography variant="h2" className={classes.header}>
                    Register
                </Typography>
                <Grid>
                    <TextField className={classes.text_fields}  label="User Name" variant="filled" required value={userName} onChange={e=>setUserName(e.target.value)}/>
                    <TextField className={classes.text_fields} label="Full Name" variant="filled" required value={fullName} onChange={e=>setFullName(e.target.value)}/>
                    <TextField className={classes.text_fields} label="Password" variant="filled" type="password" required value={password} onChange={e=>setPassword(e.target.value)}/>
                    <TextField className={classes.text_fields} label="Password Confirmation" variant="filled" required type="password"  
                    onChange={ 
                        e=>{
                            if(e.target.value===password) {
                                setError(""); 
                                setPasswordConfirmation(true);
                            }
                            else {
                                setError("Passwords are not matching"); 
                                setPasswordConfirmation(false);
                            }
                        }
                    }/>
                    <Button type="register" variant="contained" color="primary" onClick={
                        ()=>{
                            if(!fullName || !userName|| !password){
                                setError("Missing one or more fields");
                            }
                            else if(!passwordConfirmation){

                            }
                            else{
                                setError("");
                                // CREATE A REQUEST TO SERVER TO REGISTER USER TO DATABASE.
                            }
                        }
                    }>
                        Register
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
export default RegisterPage;