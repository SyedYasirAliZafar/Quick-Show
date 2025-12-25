import React, { useState } from "react";
import { dummyTrailers } from "../assets/assets.js";
import BlurCircle from "./BlurCircle";
import { PlayCircleIcon } from "lucide-react";

function TrailerSection() {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);

  // Function to convert a standard YouTube URL to embed URL
  const getEmbedUrl = (url) => {
    if (!url) return "";
    // Example: https://www.youtube.com/watch?v=abc123 → https://www.youtube.com/embed/abc123
    const youtubeMatch = url.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/
    );
    if (youtubeMatch && youtubeMatch[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    // Return the URL directly if it's already embeddable
    return url;
  };

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      <p className="text-gray-300 font-medium text-lg max-w-240 mx-auto">
        Trailers
      </p>

      <div className="relative mt-6 w-full max-w-4xl mx-auto aspect-video">
        <BlurCircle top="-100px" right="-100px" />
        <iframe
          src={getEmbedUrl(currentTrailer.videoUrl)}
          title="Trailer Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg"
        />
      </div>

      <div className="group grid grid-cols-4 md:gap-8 mt-8 max-w-3xl mx-auto">
        {dummyTrailers.map((trailer) => (
          <div
            key={trailer.image}
            className="relative group-hover:not-hover:opacity-50 hover:translate-y-1 duration-300 transition max-md:h-60 md:max-h-60 cursor-pointer"
            onClick={() => setCurrentTrailer(trailer)}
          >
            <img
              src={trailer.image}
              alt="trailer"
              className="w-40 h-24 object-cover brightness-75"
            />
            <PlayCircleIcon className="absolute top-1/2 left-1/2 w-8 h-8 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrailerSection;
