import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { makeStyles } from "@material-ui/core";
const useStyle = makeStyles((theme) => {});

const HomePage = () => {
  const classes = useStyle();
  const [data, setData] = useState();
  const requestOptions = {
    method: "GET",
    credentials: "include",
  
  };
  useEffect(() => {
    fetch("http://localhost:8002/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div>
      <p> {!data ? "Loading..." : data} </p>
    </div>
  );
};
export default HomePage;
