import React from "react";
import SongList from "./SongList";
const TopTracks = ({
  songs,
  activeIndex,
  setActiveIndex,
  setIsPlaying,
  audioManager,
  loading,
  formatTime,
}) => {
  const topSongs = songs.filter((s) => s.top_track);

  return (
    <div className="w-full">
      <SongList
        songs={topSongs}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        setIsPlaying={setIsPlaying}
        audioManager={audioManager}
        loading={loading}
        formatTime={formatTime}
      />
    </div>
  );
};

export default TopTracks;
