import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../components/Dropdown";
import Switch from "../components/Switch";
import pic from "../assets/logo.png";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Home = ({
  url,
  search,
  setSearch,
  value,
  valueGenre,
  valuePlat,
  setValue,
  setValueGenre,
  setValuePlat,
  setPage,
  page,
  setLimit,
  limit,
}) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const [display, setDisplay] = useState(false); // to display /hide the autocomplete part of search bar
  const [options, setOptions] = useState([]); // data used for autocomplete part
  const wrapperRef = useRef(null);

  const [startFilters, setStartFilters] = useState(false); // button that starts filters
  const [platformList, setPlatformList] = useState(); // get the platform list for filter
  const [genreList, setGenreList] = useState(); // get the genre list for filter
  const [check, setCheck] = useState(false); // switch component state

  const filter = {
    // sorting filter array
    results: [{ name: "name" }, { name: "released" }, { name: "rating" }],
  };

  const navigate = useNavigate();

  const sugg = [];

  useEffect(() => {
    const AbortCont = new AbortController(); // used to stop fetching datas when switching pages
    const fetchData = async () => {
      try {
        let body = {};
        if (search) {
          body.search = search;
        }
        if (page) {
          body.page = page;
        }
        if (limit) {
          body.page_size = limit;
        }
        if (value) {
          // sorting by ascending or descending order with check state
          if (!check) {
            body.sort = value.name;
          } else {
            body.sort = "-" + value.name;
          }
        }
        if (valuePlat) {
          body.platform = valuePlat.id;
        }
        if (valueGenre) {
          body.type = valueGenre.slug;
        }
        const response = await axios.get(`${url}/games`, {
          params: body,
        });
        setData(response.data);
        setIsLoading(false);

        const promises = new Array(0); // register the names of the games found for the autocomplete part of the search bar
        response.data?.results.map((elem) => {
          promises.push(elem);
        });
        promises.map((game) => {
          sugg.push(game.name);
        });
        setOptions(sugg); // data used for the autocomplete part of the search bar
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("fetch aborted");
        } else {
          console.log(error.message);
        }
      }
    };
    fetchData({ signal: AbortCont.signal });

    const fetchFilterPlat = async () => {
      // for platform filter under search bar
      try {
        const platforms = await axios.get(`${url}/games/platforms`);
        setPlatformList(platforms.data);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("fetch aborted");
        } else {
          console.log(error.message);
        }
      }
    };
    fetchFilterPlat({ signal: AbortCont.signal });

    const fetchFilterGenre = async () => {
      // for genre filter under search bar
      try {
        const genres = await axios.get(`${url}/games/genres`);
        setGenreList(genres.data);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("fetch aborted");
        } else {
          console.log(error.message);
        }
      }
    };
    fetchFilterGenre({ signal: AbortCont.signal });

    return () => {
      AbortCont.abort();
    };
  }, [search, page, limit, startFilters]);

  // when clicking in the autocomplete search to select a game
  const handleClick = (e) => {
    setSearch(e);
    setDisplay(false);
  };

  // to close the autocomplete search part when clicking outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleClickOutside = (event) => {
    const { current: wrap } = wrapperRef;
    if (wrap && !wrap.contains(event.target)) {
      setDisplay(false);
    }
  };

  // when changing page, go back to the top of the screen
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <section className="container">
      <div className="search">
        <img src={pic} alt="" style={{ width: "25vw", objectFit: "contain" }} />
        <div style={{ position: "relative" }} ref={wrapperRef}>
          <input
            // type="text"
            // id="auto"
            className="search-bar"
            placeholder="Search games..."
            value={search}
            onChange={(e) => {
              if (Cookies.get("search")) {
                Cookies.remove("search");
              }

              setSearch(e.target.value);
              // if (e.target.value === "") {
              //   setDisplay(false);
              // }
              if (!display) {
                setDisplay(true);
              }
            }}
            onClick={() => {
              if (search || display) {
                setDisplay(!display);
              }
            }}
          />
          <FontAwesomeIcon icon="search" className="search-icon" />
          {display && (
            <div className="autoContainer">
              {/* {console.log("test : ", options)} */}
              {options
                // .filter((str) => str.indexOf(search.toLowerCase()) > -1)
                .map((elem, i) => {
                  return (
                    <div
                      key={i}
                      tabIndex="0"
                      // className="option"
                      className="autoOption"
                      onClick={() => handleClick(elem)}
                    >
                      <span>{elem}</span>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {search && <div>Search result for "{search}"</div>}
        <div style={{ margin: "0.5vw 0 2vw 0", fontSize: "1.4vw" }}>
          {data.count} games
        </div>
      </div>
      {search ? (
        <div className="filter-menu">
          <div className="left-menu">
            <div style={{ marginRight: "0.43rem" }}>
              <Dropdown
                type={"Plateform"}
                prompt={"All"}
                value={valuePlat}
                option={platformList}
                onChange={(val) => {
                  if (Cookies.get("platform")) {
                    Cookies.remove("platform");
                  }
                  setValuePlat(val);
                }}
              />
            </div>
            <div>
              <Dropdown
                type={"Type"}
                prompt={"All"}
                value={valueGenre}
                option={genreList}
                onChange={(val) => {
                  if (Cookies.get("genre")) {
                    Cookies.remove("genre");
                  }
                  setValueGenre(val);
                }}
              />
            </div>
          </div>
          <div
            className="btn-clear"
            onClick={() => {
              if (Cookies.get("search")) {
                Cookies.remove("search");
              }
              if (Cookies.get("genre")) {
                Cookies.remove("genre");
              }
              if (Cookies.get("platform")) {
                Cookies.remove("platform");
              }
              if (Cookies.get("sort")) {
                Cookies.remove("sort");
              }
              if (Cookies.get("limit")) {
                Cookies.remove("limit");
              }
              if (Cookies.get("page")) {
                Cookies.remove("page");
              }
              setSearch("");
              setPage(1);
              setLimit(20);
              setValue(null);
              setValueGenre(null);
              setValuePlat(null);
            }}
          >
            clear filters
          </div>
          <div className="right-menu">
            <div style={{ display: "flex" }}>
              {!check ? (
                <span className="white">Croissant</span>
              ) : (
                <span className="white">Décroissant</span>
              )}
              <div style={{ margin: "0 0.4vw" }}>
                <Switch check={check} setCheck={setCheck} />
              </div>
            </div>
            <div style={{ marginRight: "0.5vw" }}>
              <Dropdown
                type={"Sort by"}
                prompt={"Default"}
                value={value}
                option={filter}
                onChange={(val) => {
                  if (Cookies.get("sort")) {
                    Cookies.remove("sort");
                  }
                  setValue(val);
                }}
              />
            </div>
            <button
              className="btn-filters"
              onClick={() => {
                setStartFilters(!startFilters);
              }}
            >
              Go filters !
            </button>
          </div>
        </div>
      ) : (
        <h1>{data?.seo_title}</h1>
      )}
      <div className="contain">
        {data?.results.map((game, i) => {
          //   console.log(game.slug);
          return (
            <div
              key={i}
              className="game"
              onClick={() => {
                if (search) {
                  Cookies.set("search", search);
                }
                if (page !== 1) {
                  Cookies.set("page", page);
                }
                if (limit !== 20) {
                  Cookies.set("limit", limit);
                }
                if (valuePlat) {
                  Cookies.set("platform", valuePlat);
                }
                if (value) {
                  Cookies.set("sort", value);
                }
                if (valueGenre) {
                  Cookies.set("genre", valueGenre);
                }
                navigate(`/game/${game.slug}`);
              }}
            >
              <img src={game.background_image} alt="" className="game-img" />
              <h2>{game.name}</h2>
            </div>
          );
        })}
      </div>
      <div className="load-more">
        {limit < 40 && (
          <button
            onClick={() => {
              if (Cookies.get("limit")) {
                Cookies.remove("limit");
              }
              setLimit(limit + 10);
            }}
          >
            Load more
          </button>
        )}
      </div>
      <div className="pagination">
        {data.results.map((e, i) => {
          return i + 1 >= page - 2 && i + 1 <= page + 2 ? (
            <button
              className={page === i + 1 ? "page" : "pages"}
              key={i}
              onClick={() => {
                if (Cookies.get("page")) {
                  Cookies.remove("page");
                }
                setPage(i + 1);
              }}
            >
              <span>{i + 1}</span>
            </button>
          ) : null;
        })}
      </div>
    </section>
  );
};

export default Home;
