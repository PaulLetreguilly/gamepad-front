import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";

const Signup = ({ setConnected, token }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [file, setFile] = useState({});

  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const formData = new FormData(); // To be continued...
    // formData.append("files", file);
    // formData.append("email", email);
    // formData.append("username", username);
    // formData.append("password", password);
    // formData.append("upload_preset", "v4krhqpn");
    // console.log("test log :", formData);

    try {
      if (email && username && password && confirmPassword) {
        if (confirmPassword === password) {
          console.log("first test");
          const response = await axios.post(
            "http://localhost:4000/signup",
            // formData,
            {
              email,
              username,
              password,
              //formData, // To be continued....
            }
            // {
            //   onUploadProgress: (ProgressEvent) =>
            //     console.log(
            //       "Upload progress : " +
            //         Math.round(
            //           (ProgressEvent.loaded / ProgressEvent.total) * 100
            //         ) +
            //         "%"
            //     ),
            // }
          );
          console.log(response.data);
          setConnected(response.data.token, response.data._id);
          // prendre l'id et le token et l'envoyer à setConnected
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
    <section>
      <div></div>
      <form
        onSubmit={(e) => {
          // console.log("AH");
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
          {/* <input type="file" onChange={(e) => setFile(e.target.files[0])} /> */}
        </div>
        <input type="submit" value="S'inscrire" />
        <Link to="/login">Already have an account?</Link>
      </form>
    </section>
  );
};

export default Signup;
