import React, { useEffect, useState } from "react";
import "./row.css";
import axios from "../../../Utils/axios";
import movieTrailer from "movie-trailer";
import YouTube from "react-youtube";

const Row = ({ title, fetchUrl, isLargeRow }) => {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const base_url = "https://image.tmdb.org/t/p/original";

  useEffect(() => {
    (async () => {
      try {
        // console.log(fetchUrl);
        const request = await axios.get(fetchUrl);
        // console.log(request);
        setMovies(request.data.results);
      } catch (error) {
        console.log("Error fetching movies:", error);
      }
    })();
  }, [fetchUrl]);

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.title || movie?.name || movie?.original_name)
        .then((url) => {
          if (url) {
            console.log("Trailer URL:", url);
            const urlParams = new URLSearchParams(new URL(url).search);
            console.log("URL Params:", urlParams);
            const videoId = urlParams.get("v");
            console.log("Video ID:", videoId);
            setTrailerUrl(videoId);
          } else {
            console.log("No trailer found for this movie.");
          }
        })
        .catch((error) => console.log("Error fetching trailer:", error));
    }
  };

  const opts = {
    height: "390",
    width: "100%",
    playerVars: { autoplay: 1 },
  };

  return (
    <>
      <div className="row">
        <h1>{title}</h1>
        <div className="row-posters">
          {movies?.map((movie, index) => (
            <img
              onClick={() => handleClick(movie)}
              key={movie.id || index} // Prefer using a unique identifier like movie.id
              src={`${base_url}${
                isLargeRow ? movie.poster_path : movie.backdrop_path
              }`}
              alt={movie.name}
              className={`row-poster ${isLargeRow && "row-posterLarge"}`}
            />
          ))}
        </div>
        <div style={{ padding: "40px" }}>
          {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
      </div>
    </>
  );
};

export default Row;
