import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Login = ({ setConnected, token }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      try {
        const response = await axios.post("http://localhost:4000/login", {
          email,
          password,
        });
        console.log(response.data);
        // prendre l'id et le token et l'envoyer à setConnected
        setConnected(response.data.token, response.data._id);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      alert("Veuillez remplir tout les champs");
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
        <form onSubmit={handleSubmit} className="right-part">
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
          <input type="submit" value="Connexion" />
          <Link to="/signup">
            <span>Don't have an account yet?</span>
          </Link>
        </form>
      </section>
    </section>
  );
};

export default Login;
