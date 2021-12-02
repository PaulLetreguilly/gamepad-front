import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Game = ({ userId, token }) => {
  const [data, setData] = useState();
  const [related, setRelated] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState();
  const [reviews, setReviews] = useState();
  const [changePic, setChangePic] = useState(true);
  const [reviewCheck, setReviewCheck] = useState(false);
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
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
    const fetchRelatedGames = async () => {
      try {
        const series = await axios.get(
          `http://localhost:4000/game/series/${slug}`
        );
        // console.log("related series ===> ", series.data);
        setRelated(series.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchRelatedGames();
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:4000/user", {
          params: { id: userId },
        });
        setUserData(response.data);
        // console.log(response.data);
      } catch (error) {
        console.log();
      }
    };
    fetchUser();

    const fetchReviews = async () => {
      try {
        const reviews = await axios.post(`http://localhost:4000/game/reviews`, {
          slug,
        });
        console.log(reviews.data);
        setReviews(reviews.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchReviews();
    if (reviews) {
      reviewChecker(reviews);
    }
  }, [slug, refresh, userId, reviewCheck]);

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
            "http://localhost:4000/create/favorite",
            {
              game: data,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          //   console.log(collection.data);
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
    for (let i = 0; i < userData?.Collection.length; i++) {
      if (data) {
        if (userData.Collection[i].game.id === data.id) {
          //   setCheckLike(true);
          return true;
        }
      }
    }
  };

  const handleLike = async (review) => {
    try {
      const likes = [];
      const dislikes = [];
      //   let a = 0;
      for (let i = 0; i < review.like.length; i++) {
        if (review.like[i].user._id === userData._id) {
          likes.push(review.like[i]);
          //   a = i;
        }
      }
      for (let j = 0; j < review.dislike.length; j++) {
        if (review.dislike[j].user._id === userData._id) {
          dislikes.push(review.dislike[j]);
        }
      }
      if (likes.length > 0) {
        console.log("unlike");
        // console.log(review._id);
        const unlike = await axios.post(
          "http://localhost:4000/review/unlike",
          {
            id: review._id,
            user: userData.email,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        // console.log(unlike.data);
        setRefresh(!refresh);
      } else {
        if (dislikes.length > 0) {
          console.log("like-1");
          const undislike = await axios.post(
            "http://localhost:4000/review/undislike",
            {
              id: review._id,
              user: userData.email,
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          console.log(undislike.data);

          const like = await axios.post(
            "http://localhost:4000/review/like",
            {
              id: review._id,
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          // console.log(like.data);
          setRefresh(!refresh);
        } else {
          console.log("like-2");
          const like = await axios.post(
            "http://localhost:4000/review/like",
            {
              id: review._id,
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          // console.log(like.data);
          setRefresh(!refresh);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const checkLike = (review) => {
    const arr = [];
    // let a = 0;
    for (let i = 0; i < review.like.length; i++) {
      if (review.like[i].user._id === userData._id) {
        arr.push(review.like[i]);
        // a = i;
      }
    }
    if (arr.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  const checkDislike = (review) => {
    const arr = [];
    for (let i = 0; i < review.dislike.length; i++) {
      if (review.dislike[i].user._id === userData._id) {
        arr.push(review.dislike[i]);
      }
    }
    if (arr.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  const handleDislike = async (review) => {
    try {
      const dislikes = [];
      const likes = [];
      //   let a = 0;
      for (let i = 0; i < review.dislike.length; i++) {
        if (review.dislike[i].user._id === userData._id) {
          dislikes.push(review.dislike[i]);
          //   a = i;
        }
      }
      for (let j = 0; j < review.like.length; j++) {
        if (review.like[j].user._id === userData._id) {
          likes.push(review.like[j]);
        }
      }
      if (dislikes.length > 0) {
        console.log("undislike-1");
        const undislike = await axios.post(
          "http://localhost:4000/review/undislike",
          {
            id: review._id,
            user: userData.email,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        console.log(undislike.data);
        setRefresh(!refresh);
      } else {
        console.log("dislike-2");
        if (likes.length > 0) {
          const unlike = await axios.post(
            "http://localhost:4000/review/unlike",
            {
              id: review._id,
              user: userData.email,
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          console.log(unlike.data);
          // setRefresh(!refresh);

          const dislike = await axios.post(
            "http://localhost:4000/review/dislike",
            {
              id: review._id,
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          console.log(dislike.data);
          setRefresh(!refresh);
        } else {
          const dislike = await axios.post(
            "http://localhost:4000/review/dislike",
            {
              id: review._id,
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          console.log(dislike.data);
          setRefresh(!refresh);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const reviewChecker = (reviews) => {
    let a = 0;
    for (let i = 0; i < reviews.length; i++) {
      if (reviews[i].user._id === userData._id) {
        a = 1;
      }
    }
    if (a > 0) {
      setReviewCheck(true);
      return true;
    }
  };
  const handleReview = (reviews) => {
    let a = 0;
    for (let i = 0; i < reviews.length; i++) {
      if (reviews[i].user._id === userData._id) {
        a = 1;
      }
    }
    if (a > 0) {
      setReviewCheck(true);
      alert("You already reviewed this game");
    } else {
      navigate(`/review/${data.slug}`);
    }
  };

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <section className="container">
      <section className="contain">
        <section className="part-1">
          <h3 className="white">{data.name}</h3>
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
            <div className="space-left">
              <div className="row">
                <button onClick={() => handleCollection()}>
                  {checkFavorite() ? (
                    <div>
                      Saved to{" "}
                      <span style={{ color: "green" }}>Collection</span>
                    </div>
                  ) : (
                    <div>Save to Collection</div>
                  )}
                </button>
                <button onClick={() => handleReview(reviews)}>
                  {reviewCheck ? (
                    <span>Review Added</span>
                  ) : (
                    <span>Add a Review</span>
                  )}
                </button>
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
          <h3 className="white">Games like {data.name}</h3>
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
        <section className="part-3">
          <h3 className="white">Reviews</h3>
          <div className="section-review">
            {reviews?.length === 0 && (
              <div
                style={{
                  color: "white",
                  fontSize: "2vw",
                  margin: "10vh 17.5vw",
                }}
              >
                No review (yet) for this game !
              </div>
            )}
            {reviews?.map((review) => {
              const totalLikes = review.like.length - review.dislike.length;
              return (
                <div key={review._id} className="reviews">
                  <section className="reviews-left">
                    <h4>{review.title}</h4>
                    <div>{review.description}</div>
                    <div>
                      {review.user.image && (
                        <img
                          src={review.user.image?.secure_url}
                          alt=""
                          className="user-pic"
                        />
                      )}
                      {review.user.username}
                    </div>
                  </section>
                  <section className="reviews-right">
                    <div>
                      <button
                        onClick={() => handleLike(review)}
                        className={checkLike(review) ? "like" : null}
                      >
                        like
                      </button>
                      <button
                        onClick={() => handleDislike(review)}
                        className={checkDislike(review) ? "dislike" : null}
                      >
                        dislike
                      </button>
                    </div>
                    <div>
                      {totalLikes > 0 ? (
                        <FontAwesomeIcon
                          className="positive"
                          icon="thumbs-up"
                        />
                      ) : totalLikes === 0 ? (
                        <FontAwesomeIcon className="neutral" icon="thumbs-up" />
                      ) : (
                        <FontAwesomeIcon
                          className="negative"
                          icon="thumbs-down"
                        />
                      )}
                      {totalLikes}
                    </div>
                  </section>

                  {/* {user.image && <img src={user.image} alt="" />} */}

                  {/* {review.user._id === userId && (
                    <button
                      onClick={() =>
                        alert("Delete option coming soon...(on progress)")
                      }
                    >
                      delete
                    </button>
                  )} */}
                </div>
              );
            })}
          </div>
        </section>
      </section>
    </section>
  );
};

export default Game;
