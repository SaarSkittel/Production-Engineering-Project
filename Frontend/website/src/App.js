import React from "react";
import logo from "./logo.svg";
import "./App.css";
import NavBar from "./components/NavBar";

function App() {
  const [data, setData] = React.useState();
  React.useEffect(() => {
    fetch("http://localhost:8001/")
      .then((response) => response.json())
      .then((data) => {
        setData(data[0].name);
        console.log(data.name);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="App">
      <NavBar/>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : data}</p>
      </header>
    </div>
  );
}

export default App;
