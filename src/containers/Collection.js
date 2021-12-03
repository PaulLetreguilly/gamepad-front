import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
// import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Collection = ({ userId, token, url }) => {
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
            `${url}/get/favorite`,
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
        `${url}/delete/favorite`,
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
              {/* <Link to={`/game/${elem.game.slug}`}>go to {elem.game.name}</Link> */}
              <span onClick={() => navigate(`/game/${elem.game.slug}`)}>
                {elem.game.name}
              </span>
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
