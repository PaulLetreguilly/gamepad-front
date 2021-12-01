import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../components/Dropdown";
import pic from "../assets/logo.png";

const Home = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  //   const [isOpen, setIsOpen] = useState(false);
  const [valuePlat, setValuePlat] = useState(null);
  const [valueGenre, setValueGenre] = useState(null);
  const [value, setValue] = useState(null);
  const [startFilters, setStartFilters] = useState(false);

  const [platformList, setPlatformList] = useState();
  const [genreList, setGenreList] = useState();

  const filter = {
    results: [{ name: "name" }, { name: "released" }, { name: "rating" }],
  };

  const navigate = useNavigate();

  //   useEffect(() => {
  //     const fetchFilters = async () => {
  //       const platforms = await axios.get(
  //         "https://api.rawg.io/api/platforms?key=c6ef0efe6d3541de832cc5356301f63d&page_size=51"
  //       );
  //       setPlatformList(platforms.data);
  //       const genres = await axios.get(
  //         "https://api.rawg.io/api/genres?key=c6ef0efe6d3541de832cc5356301f63d"
  //       );
  //       setGenreList(genres.data);
  //     };
  //     fetchFilters();
  //   }, []);

  useEffect(() => {
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
          body.sort = value.name;
        }
        if (valuePlat) {
          body.platform = valuePlat.id;
        }
        if (valueGenre) {
          body.type = valueGenre.slug;
        }
        const response = await axios.get("http://localhost:4000/games", {
          params: body,
        });
        // console.log(response.data);
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
        // console.log(error.response?.data.message);
      }
    };
    fetchData();
    const fetchFilters = async () => {
      const platforms = await axios.get(
        "https://api.rawg.io/api/platforms?key=c6ef0efe6d3541de832cc5356301f63d&page_size=51"
      );
      setPlatformList(platforms.data);
      const genres = await axios.get(
        "https://api.rawg.io/api/genres?key=c6ef0efe6d3541de832cc5356301f63d"
      );
      setGenreList(genres.data);
    };
    fetchFilters();
  }, [search, page, limit, startFilters]);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <section className="container">
      <div className="search">
        <img
          src={pic}
          alt=""
          style={{ width: "20vw", height: "10vh", objectFit: "cover" }}
        />
        <input
          type="text"
          className="search-bar"
          placeholder="Search games..."
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && <div>Search result for "{search}"</div>}
        <div>{data.count} games</div>
      </div>
      {search ? (
        <div className="filter-menu">
          <div className="left-menu">
            <Dropdown
              type={"Plateform"}
              prompt={"All"}
              value={valuePlat}
              option={platformList}
              onChange={(val) => setValuePlat(val)}
            />
            <Dropdown
              type={"Type"}
              prompt={"All"}
              value={valueGenre}
              option={genreList}
              onChange={(val) => setValueGenre(val)}
            />
          </div>
          <div className="right-menu">
            <Dropdown
              type={"Sort by"}
              prompt={"Default"}
              value={value}
              option={filter}
              onChange={(val) => setValue(val)}
            />
            <button
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
              onClick={() => navigate(`/game/${game.slug}`)}
            >
              <img src={game.background_image} alt="" className="game-img" />
              <h2>{game.name}</h2>
            </div>
          );
        })}
      </div>
      <div className="load-more">
        {limit < 40 && (
          <button onClick={() => setLimit(limit + 10)}>Load more</button>
        )}
      </div>
      {data.results.map((e, i) => {
        return i + 1 >= page - 2 && i + 1 <= page + 2 ? (
          <button
            className={page === i + 1 ? "page" : null}
            key={i}
            onClick={() => setPage(i + 1)}
          >
            <span>{i + 1}</span>
          </button>
        ) : null;
      })}
      {/* <div className="filter">
        <button
          className="filter_button"
          onClick={() => setIsOpen(!isOpen)}
        ></button>
        {isOpen && <div ref="dropdownref" className="filter_dropdown"></div>}
      </div> */}
    </section>
  );
};

export default Home;
