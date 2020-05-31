import React, { useState } from "react";

import Header from "./screens/Header";
import Router from "./components/Router";

import "antd/dist/antd.css";

function App() {
  const [window, setWindow] = useState("create");

  return (
    <div style={{ display: "flex" }}>
      <Header selected={window} onClick={(e) => setWindow(e.key)} />
      <Router window={window}/>
    </div>
  );
}

export default App;
