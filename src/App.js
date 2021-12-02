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
  const [userImage, setUserImage] = useState(Cookies.get("userImage") || null);
  const [username, setUsername] = useState(Cookies.get("username") || null);

  const setConnected = (token, userId, userImage, username) => {
    if (token && userId) {
      setUserToken(token);
      Cookies.set("token", token);
      setUserId(userId);
      Cookies.set("userId", userId);
      setUserImage(username);
      Cookies.set("username", username);
    } else {
      setUserToken(null);
      setUserId(null);
      Cookies.remove("token");
      Cookies.remove("userId");
      setUserImage(null);
      Cookies.remove("username");
    }
    if (token && userImage) {
      setUserImage(userImage);
      Cookies.set("userImage", userImage);
    } else {
      setUserImage(null);
      Cookies.remove("userImage");
    }
  };

  return (
    <Router>
      <Header
        setConnected={setConnected}
        userToken={userToken}
        // userImage={userImage}
        // username={username}
      />
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
