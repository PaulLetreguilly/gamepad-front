import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Profile = ({ token, userId, setConnected, url }) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState();
  const [error, setError] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const AbortCont = new AbortController();
    if (!token) {
      navigate("/");
    } else {
      const fetchData = async () => {
        try {
          const user = await axios.get(`${url}/user`, {
            params: { id: userId },
          });
          // console.log(user.data);
          setData(user.data);
          setIsLoading(false);
        } catch (error) {
          if (error.name === "AbortError") {
            console.log("fetch aborted");
          } else {
            console.log(error.message);
          }
        }
      };
      fetchData({ signal: AbortCont.signal });
    }
  }, [token, refresh]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setError("");
      const formData = new FormData();
      //   formData.append("id", userId);
      if (username) {
        formData.append("username", username);
      }
      if (email) {
        formData.append("email", email);
      }
      if (file) {
        console.log("file :", file);
        formData.append("files", file);
      }
      if (password) {
        if (password === confirmPassword) {
          formData.append("password", password);
        } else {
          setError("Veuillez rentrer deux fois le même mot de passe");
        }
      }

      if (username && file) {
        setConnected(token, userId, null, null);
      } else if (username) {
        setConnected(token, userId, Cookies.get("userImage"), null);
      } else if (file) {
        setConnected(token, userId, null, Cookies.get("username"));
      }

      const update = await axios.post(`${url}/user/update`, formData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      console.log(update.data);
      if (update.data.image) {
        setConnected(
          update.data.token,
          update.data._id,
          update.data.image.secure_url,
          update.data.username
        );
      }
      setRefresh(!refresh);
    } catch (error) {
      console.log(error.message);
    }
  };

  return isLoading ? (
    <div className="white">Loading...</div>
  ) : (
    <section className="container profile-page">
      <section className="contain connect">
        <div className="left-part">
          <div className="ft-size">userData</div>
          <div className="ft-size">
            <span className="red">username : </span>
            {data?.username}
          </div>
          <div className="ft-size">
            <span className="red">email : </span>
            {data?.email}
          </div>
          {data?.image && (
            <img
              src={data?.image.secure_url}
              alt="user-image"
              style={{
                width: "10vw",
                height: "10vw",
                borderRadius: "50%",
                objectFit: "cover",
                margin: "1vw 0 0.5vw 0",
              }}
            />
          )}
          <button onClick={() => navigate(-1)} className="btn-collec-back">
            Go back
          </button>
        </div>
        <form
          autoComplete="off"
          onSubmit={(e) => handleSubmit(e)}
          className="right-part"
        >
          <h3>update data</h3>
          <input
            type="text"
            value={username}
            placeholder={data?.username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="new-password"
          />
          <input
            type="email"
            value={email}
            placeholder={data?.email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="new-password"
          />

          <div className="contain-eye">
            <input
              type={!revealPassword ? "password" : "text"}
              value={password}
              placeholder="new password"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            {!revealPassword ? (
              <FontAwesomeIcon
                icon="eye"
                className="eye-update"
                onClick={() => setRevealPassword(!revealPassword)}
              />
            ) : (
              <FontAwesomeIcon
                icon="eye-slash"
                className="eye-update"
                onClick={() => setRevealPassword(!revealPassword)}
              />
            )}
          </div>
          <input
            type={!revealPassword ? "password" : "text"}
            value={confirmPassword}
            placeholder="confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <div style={{ color: "red" }}>{error}</div>
          <input type="submit" value="update userData" />
        </form>
      </section>
    </section>
  );
};

export default Profile;
