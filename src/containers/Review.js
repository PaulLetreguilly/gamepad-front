import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

const Review = ({ token }) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const navigate = useNavigate();
  const { slug } = useParams();
  // console.log(slug);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      const fetchGame = async () => {
        try {
          const response = await axios.get(
            `http://localhost:4000/game/${slug}`
          );
          console.log(response.data);
          setData(response.data);
          setIsLoading(false);
        } catch (error) {
          console.log(error.message);
        }
      };
      fetchGame();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        "http://localhost:4000/create/review",
        {
          title,
          text,
          game: data,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <section className="container">
      <section className="contain review">
        <form className="review-block" onSubmit={(e) => handleSubmit(e)}>
          <div className="top-review">
            <span>Write a Review</span>
            <span className="exit-review" onClick={() => navigate(-1)}>
              X
            </span>
          </div>
          <div className="review-comment">
            <span>Review title</span>
            <input
              placeholder="Title..."
              type="text"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="review-comment">
            <span>Review text</span>
            {/* <input type="text"/> */}
            <textarea
              placeholder="Type your comment here..."
              name=""
              id=""
              cols="30"
              rows="5"
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            <input type="submit" value="Publish" />
          </div>
        </form>
      </section>
    </section>
  );
};

export default Review;
