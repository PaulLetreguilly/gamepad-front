import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const Comments = ({ url, review, token, setRefresh, refresh }) => {
  const [display, setDisplay] = useState(false);
  const [data, setData] = useState();
  const [message, setMessage] = useState("");
  const [displayForm, setDisplayForm] = useState(false);
  //   const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const abortCont = new AbortController();
    //   const fetchData = async () => {
    //       try {
    //           const resp = await axios.get(`${url}/`)
    //       } catch (error) {
    //         if (error.name === "AbortError") {
    //             console.log("fetch aborted");
    //           } else {
    //             console.log(error.message);
    //           }
    //       }
    //   }
    //   fetchData({ signal: abortCont.signal })
    return () => {
      abortCont.abort();
    };
  }, [review]);

  const handleDisplay = () => {
    setDisplay(!display);
    // console.log(display);
  };
  //   const handleComments = () => {
  //     setDisplayForm(true);
  //   };
  const handleSubmit = async (e) => {
    if (token) {
      try {
        e.preventDefault();
        const addComment = await axios.post(
          `${url}/review/${review._id}/comments`,
          {
            message: message,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        console.log(addComment.data);
        //   alert("comment created");
        setDisplayForm(false);
        setRefresh(!refresh);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="comments">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          className="btn-comments"
          onClick={() => {
            // console.log(`${review._id}`);
            // setDisplay(true)
            handleDisplay();
          }}
        >
          display comments
        </div>
        <div style={{ width: "10vw" }}>
          number of comments :{" "}
          {review.comments?.length > 0 ? review.comments.length : 0}
        </div>
        <div onClick={() => setDisplayForm(true)} className="add-comment">
          add a comment
        </div>
      </div>
      {review.comments?.length > 0 && (
        <div className="comment">
          {display &&
            review.comments.map((e) => {
              //   console.log(review.comments);
              return (
                <div key={e._id} className="comment-msg">
                  {/* <img src={e.user.image.secure_url} alt="" /> */}
                  <span>{e.message}</span>
                </div>
              );
            })}
        </div>
      )}
      {displayForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <input
            className="input-comment"
            placeholder="Type your comment here..."
            type="text"
            onChange={(e) => setMessage(e.target.value)}
          ></input>
          <input type="submit" value="add your comment" />
          <div className="cancel-comment" onClick={() => setDisplayForm(false)}>
            Cancel
          </div>
        </form>
      )}
    </div>
  );
};

export default Comments;
