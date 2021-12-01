import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBookmark,
  faSearch,
  faCommentAlt,
  faUser,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";

// import axios from "axios";
import Cookies from "js-cookie";

import Home from "./containers/Home";
import Game from "./containers/Game";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Review from "./containers/Review";
import Collection from "./containers/Collection";
import Header from "./components/Header";
import Footer from "./components/Footer";
library.add(
  faBookmark,
  faSearch,
  faCommentAlt,
  faUser,
  faThumbsDown,
  faThumbsUp
);

function App() {
  const [userToken, setUserToken] = useState(Cookies.get("token") || null);
  const [userId, setUserId] = useState(Cookies.get("userId") || null);

  const setConnected = (token, userId) => {
    if (token && userId) {
      setUserToken(token);
      Cookies.set("token", token);
      setUserId(userId);
      Cookies.set("userId", userId);
    } else {
      setUserToken(null);
      setUserId(null);
      Cookies.remove("token");
      Cookies.remove("userId");
    }
  };

  return (
    <Router>
      <Header setConnected={setConnected} userToken={userToken} />
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route
          path={"/game/:slug"}
          element={<Game userId={userId} token={userToken} />}
        />
        <Route
          path={"/login"}
          element={<Login setConnected={setConnected} token={userToken} />}
        />
        <Route
          path={"/signup"}
          element={<Signup setConnected={setConnected} token={userToken} />}
        />
        <Route
          path={"/collection"}
          element={<Collection userId={userId} token={userToken} />}
        />
        <Route path={"/review/:slug"} element={<Review token={userToken} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
