import axios from "axios";
import { Movie } from "../models/movie.model.js";
import { Show } from "../models/show.model.js";

/**
 * GET /movies/now-playing
 * Fetch currently playing movies from TMDB
 */
export const getNowPlayingMovies = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
      }
    );

    const movies = response.data.results;
    res.json({ success: true, movies });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * POST /shows/add
 * Add shows for a movie
 */
export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;

    if (!movieId || !showsInput || !showPrice) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Check if movie exists in DB
    let movie = await Movie.findById(movieId);

    if (!movie) {
      // Fetch movie details from TMDB
      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
      ]);

      const movieApiData = movieDetailsResponse.data;
      const movieCreditsData = movieCreditsResponse.data;

      // Create movie in DB
      movie = await Movie.create({
        _id: movieId, // use TMDB id as _id
        movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres,
        casts: movieCreditsData.cast,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      });
    }

    // Prepare shows array
    const showsToCreate = [];

    showsInput.forEach((show) => {
      const showDate = show.date;
      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        const showDateTime = new Date(dateTimeString);

        showsToCreate.push({
          movie: movie._id, // reference ObjectId
          showDateTime,     // exact schema key
          showPrice,
          occupiedSeats: {},
        });
      });
    });

    if (showsToCreate.length > 0) {
      // Optional: prevent duplicate shows (same movie + time)
      const filteredShows = [];
      for (const show of showsToCreate) {
        const exists = await Show.findOne({
          movie: show.movie,
          showDateTime: show.showDateTime,
        });
        if (!exists) filteredShows.push(show);
      }

      if (filteredShows.length > 0) {
        await Show.insertMany(filteredShows);
      }
    }

    res.json({ success: true, message: "Show(s) added successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * GET /shows
 * Fetch unique upcoming movies with shows
 */
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });

    // Unique movies
    const uniqueMoviesMap = new Map();
    shows.forEach((show) => {
      uniqueMoviesMap.set(show.movie._id.toString(), show.movie);
    });

    res.json({ success: true, shows: Array.from(uniqueMoviesMap.values()) });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * GET /shows/:movieId
 * Fetch upcoming shows for a specific movie, grouped by date
 */
export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;

    const shows = await Show.find({
      movie: movieId,
      showDateTime: { $gte: new Date() },
    }).sort({ showDateTime: 1 });

    const movie = await Movie.findById(movieId);

    const dateTime = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];
      if (!dateTime[date]) dateTime[date] = [];

      dateTime[date].push({
        time: show.showDateTime.toISOString().slice(11, 16), // "HH:MM"
        showId: show._id,
      });
    });
    res.json({ success: true, movie, dateTime });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
