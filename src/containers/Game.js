import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

const Game = ({ userId, token }) => {
  const [data, setData] = useState();
  const [related, setRelated] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState();

  const [changePic, setChangePic] = useState(true);
  //   const [checkFav, setCheckFav] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate();

  const { slug } = useParams();
  //   console.log(id);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/game/${slug}`);
        // console.log(response.data);
        setData(response.data);
        setIsLoading(false);
        const series = await axios.get(
          `http://localhost:4000/game/series/${slug}`
        );
        // console.log("related series ===> ", series.data);
        setRelated(series.data);
        const reviews = axios.get(``);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:4000/user", {
          params: { id: userId },
        });
        setUserData(response.data);
        console.log(response.data);
      } catch (error) {
        console.log();
      }
    };
    fetchUser();
  }, [slug, refresh, userId]);

  //   useEffect(() => {
  //     // const fetchUser = async () => {
  //     //   try {
  //     //     const response = await axios.get("http://localhost:4000/user", {
  //     //       params: { id: userId },
  //     //     });
  //     //     setUserData(response.data);
  //     //     console.log(response.data);
  //     //   } catch (error) {
  //     //     console.log();
  //     //   }
  //     // };
  //     // fetchUser();
  //   }, [userId]);

  useEffect(() => {
    setTimeout(() => {
      setChangePic(!changePic);
    }, 8000);
  }, [changePic]);

  const handleCollection = async () => {
    try {
      if (token) {
        if (checkFavorite()) {
          //   console.log(data);
          const response = await axios.post(
            "http://localhost:4000/delete/favorite",
            {
              game: data,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response.data);
          setRefresh(!refresh);
        } else {
          const collection = await axios.post(
            "http://localhost:4000/create/collection",
            {
              game: data,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(collection.data);
          setRefresh(!refresh);
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const checkFavorite = () => {
    //   console.log(userData?.Collection);
    //   console.log(data);
    for (let i = 0; i < userData?.Collection.length; i++) {
      if (data) {
        if (userData.Collection[i].game.id === data.id) {
          return true;
        }
      }
    }
  };

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <section className="container">
      <section className="contain">
        <section className="part-1">
          <div className="white">{data.name}</div>
          <div className="poster">
            <img
              className="game-pic"
              src={
                changePic
                  ? data.background_image
                  : data.background_image_additional
              }
              alt=""
            />
            <div>
              <div className="row">
                <button
                  onClick={() => handleCollection()}
                  className={checkFavorite() ? "red" : null}
                >
                  {checkFavorite()
                    ? "Saved to Collection"
                    : "Save to Collection"}
                </button>
                <button>Review</button>
              </div>
              <div className="row">
                <span>
                  <div className="gray">Plateforms</div>
                  <div className="cont-data">
                    {data.platforms.map((e, i) => {
                      return (
                        <div className="white" key={i}>
                          {i !== data.platforms.length - 1
                            ? e.platform.name + ", "
                            : e.platform.name}
                        </div>
                      );
                    })}
                  </div>
                </span>
                <span>
                  <div className="gray">Genre</div>
                  {data.genres.map((e, i) => {
                    return (
                      <span className="white" key={i}>
                        {i !== data.genres.length - 1 ? e.name + ", " : e.name}
                      </span>
                    );
                  })}
                </span>
              </div>
              <div className="row">
                <span>
                  <div className="gray">Released date</div>
                  <div className="white spacing">{data.released}</div>
                </span>
                <span>
                  <div className="gray">Developer</div>
                  <div className="white spacing">
                    {data.developers[0]?.name}
                  </div>
                </span>
              </div>
              <div className="row">
                <span>
                  <div className="gray">Publisher</div>
                  <div className="white spacing">
                    {data.publishers[0]?.name}
                  </div>
                </span>
                <span>
                  <div className="gray">Age rating</div>
                  <div className="white spacing">{data.esrb_rating?.id}</div>
                </span>
              </div>
              <div>
                <h3 className="gray f12">About</h3>
                <p className="game-desc"> {data.description_raw}</p>
              </div>
            </div>
          </div>
        </section>
        <section className="part-2">
          <div className="white">Games like {data.name}</div>
          <div className="series">
            {related?.results.map((e, i) => {
              return (
                i < 5 && (
                  <div
                    className="serie"
                    key={e.id}
                    onClick={() => navigate(`/game/${e.slug}`)}
                  >
                    <h3>{e.name}</h3>
                    <img src={e.background_image} alt="" />
                  </div>
                )
              );
            })}
          </div>
        </section>
      </section>
    </section>
  );
};

export default Game;
