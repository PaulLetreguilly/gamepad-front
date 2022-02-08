import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import miniLogo from "../assets/logo-favicon.png";
import Dropdown from "../components/Dropdown";

const Signup = ({ setConnected, token, url }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState(null);
  const [dropDown, setDropDown] = useState(null);
  const [question, setQuestion] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);
  const [mobile, setMobile] = useState();

  useEffect(() => {
    const media = window.matchMedia("(max-width: 425px)").matches;
    setMobile(media);
    //console.log("second test : ", media)
  }, []);

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
      navigate("/");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const body = {};

    if (file) {
      formData.append("email", email);
      formData.append("username", username);
      formData.append("password", password);
      formData.append("question", dropDown.name);
      formData.append("answer", question);
      formData.append("files", file);
      console.log("blah");
    } else {
      // const body = {
      //   email: email,
      //   username: username,
      //   password: password,
      //   question: dropDown.name,
      //   answer: question,
      // };
      body.email = email;
      body.username = username;
      body.password = password;
      body.question = dropDown.name;
      body.answer = question;
    }
    // console.log("test formData : ", formData);
    try {
      if (email && username && password && confirmPassword) {
        if (confirmPassword === password) {
          // console.log("first test");
          if (file) {
            console.log("file test");
            const response = await axios.post(`${url}/signup`, formData, {
              onUploadProgress: (ProgressEvent) =>
                console.log(
                  "Upload progress : " +
                    Math.round(
                      (ProgressEvent.loaded / ProgressEvent.total) * 100
                    ) +
                    "%"
                ),
            });
            console.log(response.data);
            if (response.data.image) {
              setConnected(
                response.data.token,
                response.data._id,
                response.data.image.secure_url,
                response.data.username
              );
            } else {
              setConnected(
                response.data.token,
                response.data._id,
                null,
                response.data.username
              );
            }
          } else {
            console.log("pas file test");
            const response = await axios.post(`${url}/signup`, body, {
              onUploadProgress: (ProgressEvent) =>
                console.log(
                  "Upload progress : " +
                    Math.round(
                      (ProgressEvent.loaded / ProgressEvent.total) * 100
                    ) +
                    "%"
                ),
            });
            console.log(response.data);
            if (response.data.image) {
              setConnected(
                response.data.token,
                response.data._id,
                response.data.image.secure_url,
                response.data.username
              );
            } else {
              setConnected(
                response.data.token,
                response.data._id,
                null,
                response.data.username
              );
            }
          }
        } else {
          alert("Veuillez rentrer deux fois le même mot de passe");
        }
      } else {
        console.log("veuillez remplir tout les champs");
        alert("Veuillez remplir tout les champs");
      }
    } catch (error) {
      console.log(error.message);
      console.log(error.response);
    }
  };

  return (
    <section className="container">
      <section className={mobile ? "contain-mobile" : "contain connect"}>
        {!mobile && (
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
        )}
        <form
          autoComplete="off"
          className="right-part"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <h3>Sign up</h3>
          <input
            type="email"
            placeholder="Email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="new-password"
          />
          <input
            type="text"
            placeholder="Username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="new-password"
          />
          <div style={{ position: "relative" }}>
            <input
              type={!revealPassword ? "password" : "text"}
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <input
              type={!revealPassword ? "password" : "text"}
              placeholder="Confirm your password..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
            {!revealPassword ? (
              <FontAwesomeIcon
                icon="eye"
                className="eye-sign"
                onClick={() => setRevealPassword(!revealPassword)}
              />
            ) : (
              <FontAwesomeIcon
                icon="eye-slash"
                className="eye-sign"
                onClick={() => setRevealPassword(!revealPassword)}
              />
            )}
          </div>
          <div style={{ width: "30vw" }}>
            <Dropdown
              type={"Question "}
              prompt={"Choose"}
              value={dropDown}
              option={questions}
              onChange={(val) => setDropDown(val)}
            />
          </div>
          <input
            type="text"
            placeholder="Answer..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            autoComplete="new-password"
          />
          <input
            // disabled="false"
            type="file"
            name="file"
            id="file"
            className="inputfile"
            onChange={(e) => setFile(e.target.files[0])}
            // value={file}
          />
          {/* <label className="label-file" for="file">
            Choose a file
          </label> */}
          <input type="submit" value="S'inscrire" />
          <Link to="/login" style={{ textDecoration: "none" }}>
            <span className="span-text">Already have an account?</span>
          </Link>
        </form>
      </section>
    </section>
  );
};

export default Signup;
