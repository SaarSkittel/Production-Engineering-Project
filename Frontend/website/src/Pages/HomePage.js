import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { makeStyles } from "@material-ui/core";
const useStyle = makeStyles((theme) => {});

const HomePage = () => {
    const classes = useStyle();
    const [data, setData] = useState();
    useEffect(() => {
        fetch("http://localhost:8001/")
            .then((response) => response.json())
            .then((data) => {
                setData(data[0].user_name);
                console.log(data.name);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    return ( <
        div >
        <
        p > {!data ? "Loading..." : data } < /p> <
        /div>
    );
};
export default HomePage;