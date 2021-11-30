import { Link } from "react-router-dom";
import pic from "../assets/logo.png";

const Header = ({ setConnected, userToken }) => {
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
          <div className="log-out" onClick={() => setConnected(null, null)}>
            Logout
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
