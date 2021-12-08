import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import pic from "../assets/logo.png";
import { useLocation } from "react-router";
import { useEffect } from "react";

const Header = ({
  setConnected,
  userToken,
  username,
  userImage,
  search,
  value,
  valueGenre,
  valuePlat,
  page,
  limit,
}) => {
  // console.log("username", username);
  // console.log("userImage", userImage);
  const navigate = useNavigate();
  const location = useLocation();
  // console.log(location.pathname);
  // console.log(userImage);
  useEffect(() => {}, [userImage]);

  return (
    <header>
      <div className="left-header">
        <Link to="/">
          <img src={pic} alt="logo-header" />
        </Link>
      </div>
      <div className="right-header">
        <Link to="/collection">
          <div
            style={{ color: "white" }}
            onClick={() => {
              if (location.pathname === "/") {
                if (search && !Cookies.get("search")) {
                  Cookies.set("search", search);
                }
                if (page !== 1 && !Cookies.get("page")) {
                  Cookies.set("page", page);
                }
                if (limit !== 20 && !Cookies.get("limit")) {
                  Cookies.set("limit", limit);
                }
                if (value && !Cookies.get("sort")) {
                  Cookies.set("sort", value);
                }
                if (valuePlat && !Cookies.get("platform")) {
                  Cookies.set("platform", valuePlat);
                }
                if (valueGenre && !Cookies.get("genre")) {
                  Cookies.set("genre", valueGenre);
                }
              }
            }}
          >
            My collection
          </div>
        </Link>
        {userToken ? (
          <div className="user">
            <img
              src={Cookies.get("userImage") || userImage}
              alt=""
              className="user-image"
            />
            <span className="white">{username}</span>
            <div className="user-block"></div>
            <div
              className="log-out"
              onClick={() => setConnected(null, null, null, null)}
            >
              Logout
            </div>
            <div
              className="profile"
              onClick={() => {
                if (location.pathname === "/") {
                  if (search && !Cookies.get("search")) {
                    Cookies.set("search", search);
                  }
                  if (page !== 1 && !Cookies.get("page")) {
                    Cookies.set("page", page);
                  }
                  if (limit !== 20 && !Cookies.get("limit")) {
                    Cookies.set("limit", limit);
                  }
                  if (value && !Cookies.get("sort")) {
                    Cookies.set("sort", value);
                  }
                  if (valuePlat && !Cookies.get("platform")) {
                    Cookies.set("platform", valuePlat);
                  }
                  if (valueGenre && !Cookies.get("genre")) {
                    Cookies.set("genre", valueGenre);
                  }
                }
                navigate("/user/profile");
              }}
            >
              My profile
            </div>
          </div>
        ) : (
          <Link to="/login">
            <div
              style={{ color: "white" }}
              onClick={() => {
                if (location.pathname === "/") {
                  if (search && !Cookies.get("search")) {
                    Cookies.set("search", search);
                  }
                  if (page !== 1 && !Cookies.get("page")) {
                    Cookies.set("page", page);
                  }
                  if (limit !== 20 && !Cookies.get("limit")) {
                    Cookies.set("limit", limit);
                  }
                  if (value && !Cookies.get("sort")) {
                    Cookies.set("sort", value);
                  }
                  if (valuePlat && !Cookies.get("platform")) {
                    Cookies.set("platform", valuePlat);
                  }
                  if (valueGenre && !Cookies.get("genre")) {
                    Cookies.set("genre", valueGenre);
                  }
                }
              }}
            >
              Login
            </div>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
