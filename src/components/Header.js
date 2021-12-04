import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import pic from "../assets/logo.png";

const Header = ({ setConnected, userToken, username, userImage }) => {
  // console.log("username", username);
  // console.log("userImage", userImage);
  const navigate = useNavigate();
  return (
    <header>
      <div className="left-header">
        <Link to="/">
          <img src={pic} alt="" />
        </Link>
      </div>
      <div className="right-header">
        <Link to="/collection">
          <div style={{ color: "white" }}>My collection</div>
        </Link>
        {userToken ? (
          <div className="user">
            <img src={userImage} alt="" className="user-image" />
            <span className="white">{username}</span>
            <div className="user-block"></div>
            <div
              className="log-out"
              onClick={() => setConnected(null, null, null, null)}
            >
              Logout
            </div>
            <div className="profile" onClick={() => navigate("/user/profile")}>
              My profile
            </div>
          </div>
        ) : (
          <Link to="/login">
            <div style={{ color: "white" }}>Login</div>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
