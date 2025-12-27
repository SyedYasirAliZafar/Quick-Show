import { useState, useRef } from "react";
import { X, Calendar, Clock } from "lucide-react";
import { dummyShowsData } from "../../assets/assets";
import MovieCard from "../../components/admin/MovieCard";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";

const AddShows = () => {
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [showPrice, setShowPrice] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showTimes, setShowTimes] = useState([]);

  const dateRef = useRef(null);
  const timeRef = useRef(null);

  // Movie select toggle
  const handleMovieSelect = (id) => {
    setSelectedMovies((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  // Open native pickers
  const openDatePicker = () => {
    if (dateRef.current?.showPicker) dateRef.current.showPicker();
    else dateRef.current.focus();
  };

  const openTimePicker = () => {
    if (timeRef.current?.showPicker) timeRef.current.showPicker();
    else timeRef.current.focus();
  };

  // Add date & time
  const handleAddTime = () => {
    if (!selectedDate || !selectedTime) return;

    setShowTimes((prev) => {
      const existing = prev.find((d) => d.date === selectedDate);

      if (existing) {
        return prev.map((d) =>
          d.date === selectedDate
            ? { ...d, times: [...d.times, selectedTime] }
            : d
        );
      }

      return [...prev, { date: selectedDate, times: [selectedTime] }];
    });

    setSelectedTime("");
  };

  // Remove time
  const handleRemoveTime = (date, time) => {
    setShowTimes((prev) =>
      prev
        .map((d) =>
          d.date === date
            ? { ...d, times: d.times.filter((t) => t !== time) }
            : d
        )
        .filter((d) => d.times.length > 0)
    );
  };

  // Submit
  const handleAddShow = () => {
    console.log({
      selectedMovies,
      showPrice,
      showTimes,
    });
  };

  return (
    <div className="min-h-screen p-6 md:p-8 bg-black text-white">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* TITLE */}
        
        <Title text1="Add" text2="Shows" />

        {/* MOVIE LIST */}
        <div className="space-y-4">
          <p className="text-lg font-medium">Now Playing Movies</p>
          <BlurCircle top='300px' right='10px' />
          <BlurCircle bottom='50px' right='800px' />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dummyShowsData.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                genres={movie.genres.map((g) => g.name)}
                rating={movie.vote_average}
                votes={movie.vote_count}
                posterUrl={movie.poster_path}
                isSelected={selectedMovies.includes(movie.id)}
                onSelect={handleMovieSelect}
              />
            ))}
          </div>
        </div>

        {/* PRICE */}
        <div className="space-y-2">
          <label className="text-sm px-2 font-medium">Show Price</label>
          <input
            type="number"
            placeholder="Enter show price"
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-48 bg-transparent text-white placeholder-gray-400"
          />
        </div>

        {/* DATE & TIME */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Date & Time</label>
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            {/* Date Input */}
            <div className="relative w-full sm:w-auto">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                ref={dateRef}
                className="w-full border border-gray-300 rounded px-3 py-2 pr-10 bg-black text-white placeholder-gray-400 appearance-none"
              />
              <Calendar
                size={20}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white cursor-pointer"
                onClick={openDatePicker}
              />
            </div>

            {/* Time Input */}
            <div className="relative w-full sm:w-auto">
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                ref={timeRef}
                className="w-full border border-gray-300 rounded px-3 py-2 pr-10 bg-black text-white placeholder-gray-400 appearance-none"
              />
              <Clock
                size={20}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white cursor-pointer"
                onClick={openTimePicker}
              />
            </div>

            <button
              onClick={handleAddTime}
              className="bg-primary cursor-pointer active:scale-95 transition text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              Add Time
            </button>
          </div>
        </div>

        {/* SHOW TIMES */}
        {showTimes.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Selected Date & Time</p>
            {showTimes.map((d) => (
              <div key={d.date}>
                <p className="text-sm">{d.date}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {d.times.map((time) => (
                    <div
                      key={time}
                      className="flex items-center gap-1 px-3 py-1 border border-primary rounded text-sm"
                    >
                      <span>{time}</span>
                      <X
                        className="w-3 h-3 cursor-pointer text-primary"
                        onClick={() => handleRemoveTime(d.date, time)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SUBMIT */}
        <button
          onClick={handleAddShow}
          className="bg-primary text-white px-8 py-2 rounded cursor-pointer active:scale-95 transition"
        >
          Add Show
        </button>
      </div>
    </div>
  );
};

export default AddShows;
