import React from "react";

const SongList = ({
  songs,
  activeIndex,
  setActiveIndex,
  setIsPlaying,
  audioManager,
  loading,
  formatTime,
}) => {
  return (
    <section className="w-full">
      <div className="songlist h-[70vh] md:h-[80vh] overflow-y-auto hide-scrollbar sm:h-[0vh]">
        {loading ? (
          <div className="animate-pulse p-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="mb-3 flex items-center gap-3">
                <div className="w-14 h-14 bg-white/6 rounded" />
                <div className="flex-1">
                  <div className="h-4 bg-white/6 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-white/6 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : songs.length === 0 ? (
          <div className="p-6 text-white/70">No songs found.</div>
        ) : (
          <ul className="space-y-3">
            {songs.map((s, i) => (
              <li
                key={s.id}
                className={`flex items-center gap-3 py-2 sm:py-3 rounded-lg p-2 sm:p-3 cursor-pointer ${
                  i === activeIndex ? "bg-white/10" : "hover:bg-white/6"
                }`}
                onClick={() => {
                  setActiveIndex(i);
                  setIsPlaying(true);
                  setTimeout(() => audioManager.play(), 80);
                }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded overflow-hidden bg-white/5 flex-shrink-0">
                  {s.cover ? (
                    <img
                      src={s.cover}
                      alt="c"
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm sm:text-base text-white font-medium truncate">
                      {s.title}
                    </div>
                    <div className="text-xs sm:text-sm text-white/60">
                      {s.duration ? formatTime(s.duration) : "--:--"}
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm text-white/60">
                    {s.artist}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default SongList;
