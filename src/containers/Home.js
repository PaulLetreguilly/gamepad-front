import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../components/Dropdown";
import Switch from "../components/Switch";
import pic from "../assets/logo.png";
import Cookies from "js-cookie";

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
  const [array, setArray] = useState([]);

  // const [search, setSearch] = useState(Cookies.get("search") || ""); // search bar input
  // const [page, setPage] = useState(Cookies.get("page") || 1); // pagination at the bottom
  // const [limit, setLimit] = useState(Cookies.get("limit") || 20); // number of games loaded in the page, can change => next to pagination (button load more)
  // const [valuePlat, setValuePlat] = useState(Cookies.get("platform") || null); // platform filter
  // const [valueGenre, setValueGenre] = useState(Cookies.get("genre") || null); //game genre filter
  // const [value, setValue] = useState(Cookies.get("sort") || null); // sorting filter
  const [startFilters, setStartFilters] = useState(false); // button that starts filters
  const [platformList, setPlatformList] = useState(); // get the platform list for filter
  const [genreList, setGenreList] = useState(); // get the genre list for filter
  const [check, setCheck] = useState(false); // switch component state

  const filter = {
    // sorting filter array
    results: [{ name: "name" }, { name: "released" }, { name: "rating" }],
  };

  const navigate = useNavigate();

  useEffect(() => {
    const AbortCont = new AbortController();
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
        // if (Cookies.get("search")) {
        //   console.log(Cookies.get("search"));
        // }
        setData(response.data);
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
    const fetchFilterPlat = async () => {
      try {
        const platforms = await axios.get(
          `https://api.rawg.io/api/platforms?key=c6ef0efe6d3541de832cc5356301f63d&page_size=51`
        );
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
      try {
        const genres = await axios.get(
          `https://api.rawg.io/api/genres?key=c6ef0efe6d3541de832cc5356301f63d`
        );
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
  }, [search, page, limit, startFilters]);

  const arr = [];
  const autoComplete = () => {
    // const arr = [...array];
    data?.results.map((e, i) => {
      const str = e.name.toLowerCase();
      arr.push(str);
    });
    // setArray(arr);
  };
  search && autoComplete();

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <section className="container">
      <div className="search">
        <img
          src={pic}
          alt=""
          style={{ width: "20vw", height: "14vh", objectFit: "contain" }}
        />
        <div style={{ position: "relative" }}>
          <input
            type="text"
            className="search-bar"
            placeholder="Search games..."
            value={search}
            onChange={(e) => {
              if (Cookies.get("search")) {
                Cookies.remove("search");
              }
              setSearch(e.target.value);
              setArray(arr);
            }}
            onBlur={() => {
              setTimeout(() => {
                setArray([]);
              }, 200);
            }}
          />
          <div className={`auto-complete ${search ? "display" : "none"}`}>
            {array?.map((e, i) => {
              return (
                <div
                  key={i}
                  className="result-auto-comp"
                  onClick={() => {
                    // console.log(e);
                    setSearch(e);
                    setArray([]);
                  }}
                >
                  {e}
                </div>
              );
            })}
          </div>
        </div>

        {search && <div>Search result for "{search}"</div>}
        <div style={{ margin: "0.5vw 0 2vw 0" }}>{data.count} games</div>
      </div>
      {search ? (
        <div className="filter-menu">
          <div className="left-menu">
            <div style={{ width: "16vw", marginRight: "0.5vw" }}>
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
            {/* <Dropdown
              type={"Plateform"}
              prompt={"All"}
              value={valuePlat}
              option={platformList}
              onChange={(val) => setValuePlat(val)}
            /> */}
            <div style={{ width: "14vw" }}>
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
            {/* <Dropdown
              type={"Type"}
              prompt={"All"}
              value={valueGenre}
              option={genreList}
              onChange={(val) => setValueGenre(val)}
            /> */}
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
              <div style={{ margin: "0 2rem" }}>
                <Switch check={check} setCheck={setCheck} />
              </div>
            </div>
            <div style={{ width: "12vw", marginRight: "0.5vw" }}>
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
            {/* <Dropdown
              type={"Sort by"}
              prompt={"Default"}
              value={value}
              option={filter}
              onChange={(val) => setValue(val)}
            /> */}
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
