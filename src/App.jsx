import React, { useState, useEffect, useRef } from "react";
import AudioManager from "./components/AudioManager";
import SearchTabs from "./components/SearchTabs";
import SongList from "./components/SongList";
import PlayerControls from "./components/PlayerControls";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import Spotify_logo from "./assets/Spotify_logo.png";

import {
  mapApiSong,
  getAverageColorFromImage,
  formatTime,
} from "./components/utils";
import Leftcomponent from "./components/Leftcomponent";

const App = () => {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bgColor, setBgColor] = useState("rgb(30,30,30)");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("foryou");
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const audioManagerRef = useRef(null);
  const seekerRef = useRef(null);

  if (!audioManagerRef.current) audioManagerRef.current = new AudioManager();
  const audioManager = audioManagerRef.current;

  const displayedSongs = filteredSongs;

  // Fetch songs from API
  useEffect(() => {
    async function fetchSongs() {
      try {
        setLoading(true);
        const res = await fetch("https://cms.samespace.com/items/songs");
        const json = await res.json();
        if (!json || !json.data) {
          console.error("API response invalid:", json);
          return;
        }
        const mapped = json.data.map(mapApiSong);
        setSongs(mapped);
        setFilteredSongs(mapped);
        setActiveIndex(0);
      } catch (err) {
        console.error("Error fetching songs:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSongs();
  }, []);

  // Update audio
  useEffect(() => {
    if (!songs.length) return;
    const currentSong = songs[activeIndex];
    if (!currentSong) return;

    audioManager.setSrc(currentSong.audio);
    if (isPlaying) audioManager.play();

    getAverageColorFromImage(currentSong.cover).then((c) => {
      setBgColor(`rgb(${c.r}, ${c.g}, ${c.b})`);
    });

    audioManager.audio.onloadedmetadata = () => {
      setDuration(audioManager.getDuration());
    };

    audioManager.onTimeUpdate = (time) => setPosition(time);
    audioManager.onEnded = () => handleNext();
  }, [activeIndex, songs, isPlaying]);

  // Seek handler
  const handleSeek = (e) => {
    const t = Number(e.target.value);
    audioManager.seek(t);
    setPosition(t);
  };

  // Play or Pause
  const handlePlayPause = () => {
    if (isPlaying) {
      audioManager.pause();
    } else {
      audioManager.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Next or Prev
  const handleNext = () => {
    setActiveIndex((i) => (i + 1) % songs.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setActiveIndex((i) => (i - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  // Search filter
  useEffect(() => {
    if (!query) {
      setFilteredSongs(songs);
    } else {
      const q = query.toLowerCase();
      setFilteredSongs(
        songs.filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.artist.toLowerCase().includes(q)
        )
      );
    }
  }, [query, songs]);

  return (
    <>
      <div
        className="min-h-screen w-full flex flex-col lg:flex-row text-white transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, ${bgColor}, #000)`,
        }}
      >
        <aside className="hidden lg:flex w-full lg:w-[20%] flex-shrink-0 flex-col justify-between p-4 lg:p-6">
          <Leftcomponent />
        </aside>
        <div className="leftcomponent hidden sm:flex lg:hidden w-full lg:w-[20%] flex-shrink-0 justify-between p-4">
          <Leftcomponent />
        </div>

        <main className="flex-1 flex flex-col md:flex-row sm:pl-10 ">
          <div className="flex md:hidden items-center justify-between p-4">
            <img
              src={Spotify_logo}
              alt="Spotify logo"
              className="h-[40px] w-[133px]"
            />
            <button onClick={() => setMenuOpen(true)}>
              <FiMenu size={28} />
            </button>
          </div>

          {menuOpen && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex">
              <div className="bg-neutral-900 w-full h-full p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Songs</h2>
                  <button onClick={() => setMenuOpen(false)}>
                    <IoClose size={28} />
                  </button>
                </div>

                <SearchTabs
                  tab={tab}
                  setTab={setTab}
                  query={query}
                  setQuery={setQuery}
                />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="w-full lg:w-full max-h-[50vh] lg:max-h-full flex"
                  >
                    <SongList
                      songs={displayedSongs}
                      activeIndex={activeIndex}
                      setActiveIndex={(clickedIndex) => {
                        const song = displayedSongs[clickedIndex];
                        const realIndex = songs.findIndex(
                          (s) => s.id === song.id
                        );
                        if (realIndex !== -1) {
                          setActiveIndex(realIndex);
                          setIsPlaying(true);
                        }
                      }}
                      setIsPlaying={setIsPlaying}
                      audioManager={audioManager}
                      loading={loading}
                      formatTime={formatTime}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex-1" onClick={() => setMenuOpen(false)} />
            </div>
          )}

          <div className="hidden md:block w-[30%]">
            <div className="pt-4 ">
              <SearchTabs
                tab={tab}
                setTab={setTab}
                query={query}
                setQuery={setQuery}
              />
            </div>

            <div className="w-full lg:w-full max-h-[50vh] lg:max-h-full flex">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="w-full lg:w-full max-h-[50vh] lg:max-h-full flex"
                >
                  <SongList
                    songs={displayedSongs}
                    activeIndex={activeIndex}
                    setActiveIndex={(clickedIndex) => {
                      const song = displayedSongs[clickedIndex];
                      const realIndex = songs.findIndex(
                        (s) => s.id === song.id
                      );
                      if (realIndex !== -1) {
                        setActiveIndex(realIndex);
                        setIsPlaying(true);
                      }
                    }}
                    setIsPlaying={setIsPlaying}
                    audioManager={audioManager}
                    loading={loading}
                    formatTime={formatTime}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex-1 flex flex-col px-4 pt-6 md:pt-12 md:px-8 pb-4 md:pb-8 gap-6">
            <div className="w-full flex flex-col items-center">
              <PlayerControls
                song={songs.length > 0 ? songs[activeIndex] : null}
                isPlaying={isPlaying}
                handlePlayPause={handlePlayPause}
                handlePrev={handlePrev}
                handleNext={handleNext}
                handleSeek={handleSeek}
                position={position}
                duration={duration}
                formatTime={formatTime}
                seekerRef={seekerRef}
                audioManager={audioManager}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default App;
