import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Collection = ({ userId, token }) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    } else {
      const fetchCollection = async () => {
        try {
          // console.log("my token : ", token);
          const response = await axios.get(
            "http://localhost:4000/get/favorite",
            // {
            //   params: { _id: userId },
            // },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // console.log(response.data);
          setData(response.data);
          setIsLoading(false);
        } catch (error) {
          console.log(error.message);
        }
      };
      fetchCollection();
    }
  }, [userId, refresh]);

  const deleteFavorite = async (elem) => {
    // console.log("clicked on :", id);
    // console.log(elem);
    try {
      const deleteThis = await axios.post(
        "http://localhost:4000/delete/favorite",
        { game: elem },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // alert(deleteThis.data);
      setRefresh(!refresh);
    } catch (error) {
      console.log(error.message);
    }
  };

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <section className="container collection">
      <button onClick={() => navigate(-1)}>Go back</button>
      <div className="favorites">
        {data.Collection.map((elem) => {
          return (
            <div className="favorite" key={elem._id}>
              <span>{elem.game.name}</span>
              <img src={elem.game.background_image} alt="" />
              <FontAwesomeIcon
                icon="bookmark"
                className="icon"
                onClick={() => deleteFavorite(elem.game)}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Collection;
