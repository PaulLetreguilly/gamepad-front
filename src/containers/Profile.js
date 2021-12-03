import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";

const Profile = ({ token, userId, setConnected, url }) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState({});
  const [error, setError] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      const fetchData = async () => {
        try {
          const user = await axios.get(`${url}/user`, {
            params: { id: userId },
          });
          console.log(user.data);
          setData(user.data);
          setIsLoading(false);
        } catch (error) {
          console.log(error.message);
        }
      };
      fetchData();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      //   formData.append("id", userId);
      if (username) {
        formData.append("username", username);
      }
      if (email) {
        formData.append("email", email);
      }
      if (file) {
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
      //   console.log(update.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <section className="container profile-page">
      <section className="contain connect">
        <div className="left-part">
          <div>display userData (coming soon...)</div>
          <div>
            <span className="red">username : </span>
            {data.username}
          </div>
          <div>
            <span className="red">email : </span>
            {data.email}
          </div>
          {/* <div>{data.username}</div> */}
          {/* <div></div> */}
          {data.image && (
            <img
              src={data.image.secure_url}
              alt="user-image"
              style={{
                width: "10vw",
                height: "10vw",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          )}
          <button onClick={() => navigate(-1)}>Go back</button>
        </div>
        <form onSubmit={(e) => handleSubmit(e)} className="right-part">
          <h3>update data</h3>
          <input
            type="text"
            value={username}
            placeholder={data.username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            value={email}
            placeholder={data.email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            value={password}
            placeholder="new password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            value={confirmPassword}
            placeholder="confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
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