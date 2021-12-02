import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Signup = ({ setConnected, token }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("files", file);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);

    try {
      if (email && username && password && confirmPassword) {
        if (confirmPassword === password) {
          console.log("first test");
          const response = await axios.post(
            "http://localhost:4000/signup",
            formData,
            {
              onUploadProgress: (ProgressEvent) =>
                console.log(
                  "Upload progress : " +
                    Math.round(
                      (ProgressEvent.loaded / ProgressEvent.total) * 100
                    ) +
                    "%"
                ),
            }
          );
          console.log(response.data);
          setConnected(
            response.data.token,
            response.data._id,
            response.data.image.secure_url,
            response.data.username
          );
        } else {
          alert("Veuillez rentrer deux fois le même mot de passe");
        }
      } else {
        console.log("veuillez remplir tout les champs");
        alert("Veuillez remplir tout les champs");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <section className="container">
      <section className="contain connect">
        <div className="left-part">
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
        <form
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
          />
          <input
            type="text"
            placeholder="Username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div>
            <input
              type="password"
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm your password..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            // value={file}
          />
          <input type="submit" value="S'inscrire" />
          <Link to="/login">
            <span>Already have an account?</span>
          </Link>
        </form>
      </section>
    </section>
  );
};

export default Signup;
