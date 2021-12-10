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
  faEye,
  faEyeSlash,
  // faSearch,
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
  faThumbsUp,
  faEye,
  faEyeSlash
  // faSearch
);

function App() {
  const [userToken, setUserToken] = useState(Cookies.get("token") || null);
  const [userId, setUserId] = useState(Cookies.get("userId") || null);
  const [userImage, setUserImage] = useState(Cookies.get("userImage") || null);
  const [username, setUsername] = useState(Cookies.get("username") || null);

  // states below are for homepage, but are also sent to header to save search queries with cookies

  const [search, setSearch] = useState(Cookies.get("search") || ""); // search bar input
  const [page, setPage] = useState(Cookies.get("page") || 1); // pagination at the bottom
  const [limit, setLimit] = useState(Cookies.get("limit") || 20); // number of games loaded in the page, can change => next to pagination (button load more)
  const [valuePlat, setValuePlat] = useState(Cookies.get("platform") || null); // platform filter
  const [valueGenre, setValueGenre] = useState(Cookies.get("genre") || null); //game genre filter
  const [value, setValue] = useState(Cookies.get("sort") || null); // sorting filter

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
        search={search} // values from homepage, used to save search params when navigating with header
        value={value}
        page={page}
        limit={limit}
        valuePlat={valuePlat}
        valueGenre={valueGenre}
      />
      <Routes>
        <Route
          path={"/"}
          element={
            <Home
              url={url}
              search={search} // values from homepage, used to save search params when navigating with header
              setSearch={setSearch}
              value={value}
              setValue={setValue}
              page={page}
              setPage={setPage}
              setLimit={setLimit}
              limit={limit}
              setValueGenre={setValueGenre}
              setValuePlat={setValuePlat}
              valuePlat={valuePlat}
              valueGenre={valueGenre}
            />
          }
        />
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
