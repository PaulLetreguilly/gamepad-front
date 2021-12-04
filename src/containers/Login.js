import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import miniLogo from "../assets/logo-favicon.png";
import Dropdown from "../components/Dropdown";

const Login = ({ setConnected, token, url }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotten, setForgotten] = useState(false);
  const [error, setError] = useState("");
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [yourEmail, setYourEmail] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);

  const questions = {
    results: [
      { name: "What's your childhood bestfriend's name ?" },
      { name: "What's the name of your elementary school ?" },
      { name: "What's your favorite game ?" },
    ],
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      navigate(-1);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (email && password) {
      try {
        const response = await axios.post(`${url}/login`, {
          email,
          password,
        });
        // console.log(response.data);
        // prendre l'id et le token et l'envoyer à setConnected
        setConnected(
          response.data.token,
          response.data._id,
          response.data.image.secure_url,
          response.data.username
        );
      } catch (error) {
        if (
          error.response.data.message === "Unauthorized" ||
          error.response.data.message === "User not found"
        ) {
          setError("wrong email/password");
          console.log(error.message);
          // console.log(error.response.data.message);
        } else {
          console.log(error.message);
          // console.log(error.response.data.message);
        }
      }
    } else {
      // alert("Veuillez remplir tout les champs");
      setError("Veuillez remplir tout les champs");
    }
  };

  const handleForgotten = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (password && question && yourEmail && answer) {
        if (password === confirmPassword) {
          const resp = await axios.post(`${url}/user/password`, {
            question,
            answer,
            yourEmail,
            password,
          });
          console.log(resp.data);
          setConnected(
            resp.data.token,
            resp.data._id,
            resp.data.image.secure_url,
            resp.data.username
          );
        } else if (!confirmPassword) {
          setError("Type in your password a second time");
        } else {
          setError("Type the same password twice");
        }
      } else {
        setError("Missing parameters");
      }
    } catch (error) {
      if (error.response.data.message === "wrong question/answer") {
        console.log(error.message);
        setError(error.response.data.message);
      } else if (
        error.response.data.message ===
        "New password must be different from old one"
      ) {
        setError(error.response.data.message);
      } else {
        console.log(error.message);
        console.log(error.response.data.message);
      }
    }
  };

  return (
    <section className="container">
      <section className="contain connect">
        <div className="left-part">
          <img src={miniLogo} alt="logo" className="mini-logo" />
          <h3>How does it work?</h3>
          <div className="text">
            <FontAwesomeIcon icon="user" className="connect-icon" />
            Log in to your free account to be able to get all features of
            Gamepad
          </div>
          <div className="text">
            <FontAwesomeIcon icon="bookmark" className="connect-icon" /> Add a
            game to your collection
          </div>
          <div className="text">
            <FontAwesomeIcon icon="comment-alt" className="connect-icon" />{" "}
            Leave a review for a game
          </div>
        </div>
        {forgotten ? (
          <form className="right-part forget" onSubmit={handleForgotten}>
            <span>so your forgot uh...</span>
            <input
              type="text"
              value={yourEmail}
              placeholder="Your email"
              onChange={(e) => setYourEmail(e.target.value)}
            />
            <div style={{ width: "30vw" }}>
              <Dropdown
                type={"Question "}
                prompt={"Choose"}
                value={question}
                option={questions}
                onChange={(val) => setQuestion(val)}
              />
            </div>
            <input
              type="text"
              placeholder="Your answer..."
              onChange={(e) => setAnswer(e.target.value)}
            />
            <input
              type="password"
              placeholder="new password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <input
              type="password"
              placeholder="confirm your password"
              onChange={(e) => setconfirmPassword(e.target.value)}
              value={confirmPassword}
            />
            <div style={{ color: "red" }}>{error}</div>
            <input type="submit" value="change password" />
            <div
              className="btn-forgotten"
              onClick={() => {
                setError("");
                setPassword("");
                setForgotten(false);
              }}
            >
              WAIT !! I remember my password now...
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="right-part">
            <h3>Login</h3>
            <input
              type="email"
              placeholder="Email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type={!revealPassword ? "password" : "text"}
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {!revealPassword ? (
              <FontAwesomeIcon
                icon="eye"
                className="eye-login"
                onClick={() => setRevealPassword(!revealPassword)}
              />
            ) : (
              <FontAwesomeIcon
                icon="eye-slash"
                className="eye-login"
                onClick={() => setRevealPassword(!revealPassword)}
              />
            )}
            <div style={{ color: "red" }}>{error}</div>
            <div
              className="forgot"
              onClick={() => {
                setError("");
                setPassword("");
                setForgotten(true);
              }}
            >
              forgot your password ?
            </div>
            <input type="submit" value="Connexion" />
            <Link to="/signup">
              <span>Don't have an account yet?</span>
            </Link>
          </form>
        )}
        {/* <form onSubmit={handleSubmit} className="right-part">
          <h3>Login</h3>
          <input
            type="email"
            placeholder="Email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="forgot" onClick={() => setForgotten(true)}>
            forgot your password ?
          </div>
          <input type="submit" value="Connexion" />
          <Link to="/signup">
            <span>Don't have an account yet?</span>
          </Link>
        </form> */}
      </section>
    </section>
  );
};

export default Login;
