// App.tsx

import React from "react";
import { Container } from "react-bootstrap";
import "./App.css";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import Comment from "./components/Comment";


const App: React.FC = () => {
  return (
    <Container fluid>
      <NavBar />
      <Home />
      <Comment />
    </Container>
  );
};

export default App;