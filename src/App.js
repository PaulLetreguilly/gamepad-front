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

import Cookies from "js-cookie";

import Home from "./containers/Home";
import Game from "./containers/Game";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Review from "./containers/Review";
import Collection from "./containers/Collection";
import Profile from "./containers/Profile";
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

  // const url = "http://localhost:4000";
  const url = "https://my-gamepad.herokuapp.com";
  // use this const to switch from local to online server once deployed on heroku

  const setConnected = (token, userId, userImage, username) => {
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
    if (token && username) {
      setUsername(username);
      Cookies.set("username", username);
    } else {
      setUsername(null);
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
        userImage={userImage}
        username={username}
      />
      <Routes>
        <Route path={"/"} element={<Home url={url} />} />
        <Route
          path={"/game/:slug"}
          element={<Game userId={userId} token={userToken} url={url} />}
        />
        <Route
          path={"/login"}
          element={
            <Login setConnected={setConnected} token={userToken} url={url} />
          }
        />
        <Route
          path={"/signup"}
          element={
            <Signup setConnected={setConnected} token={userToken} url={url} />
          }
        />
        <Route
          path={"/collection"}
          element={<Collection userId={userId} token={userToken} url={url} />}
        />
        <Route
          path={"/review/:slug"}
          element={<Review token={userToken} url={url} />}
        />
        <Route
          path={"/user/profile"}
          element={
            <Profile
              url={url}
              token={userToken}
              userId={userId}
              setConnected={setConnected}
            />
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
