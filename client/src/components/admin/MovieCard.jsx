import React from "react";
import { StarIcon, Check } from "lucide-react";

function MovieCard({
  id,
  title,
  posterUrl,
  rating,
  votes,
  genres = [],
  isSelected = false,
  onSelect,
}) {
  return (
    <div
      onClick={() => onSelect(id)}
      className={`group relative cursor-pointer rounded overflow-hidden hover:-translate-y-1 transition duration-300
        ${isSelected ? "ring-2 ring-blue-500" : " hover:ring-blue-500"}
      `}
    >
      {/* Poster */}
      <img
        src={posterUrl}
        alt={title}
        className="w-full h-60 sm:h-72 md:h-80 lg:h-[380px] object-cover transition-all duration-300"
      />

      {/* Checkbox */}
      <div
        className={`absolute top-2 sm:top-3 right-2 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center
          ${isSelected ? "bg-pink-500" : "border border-pink-500"}
        `}
      >
        {isSelected && <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />}
      </div>

      {/* Bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 p-2 sm:p-4 w-full text-white">
        {/* Rating */}
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm mb-1">
          <StarIcon className="h-3 w-4 sm:h-4 sm:w-5 text-primary fill-primary" />
          <span>{rating.toFixed(1)}/5</span>
          <span className="text-gray-300 ml-1 sm:ml-2">{votes.toLocaleString()} Votes</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-sm sm:text-lg leading-tight">{title}</h3>

        {/* Genres */}
        <p className="text-[10px] sm:text-xs text-gray-300 mt-1">{genres.join(", ")}</p>
      </div>
    </div>
  );
}

export default MovieCard;
