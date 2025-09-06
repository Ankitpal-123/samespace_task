import React, { useState, useEffect, useRef } from "react";
import AudioManager from "./components/AudioManager";
import SearchTabs from "./components/SearchTabs";
import SongList from "./components/SongList";
import PlayerControls from "./components/PlayerControls";
import {
  mapApiSong,
  getAverageColorFromImage,
  formatTime,
} from "./components/utils";

export default function MusicPlayer() {
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

  const seekerRef = useRef(null);
  const audioManager = new AudioManager();

  // Fetch songs
  useEffect(() => {
    async function fetchSongs() {
      try {
        setLoading(true);
        const res = await fetch("https://cms.samespace.com/items/songs");
        const json = await res.json();

        // 👇 Debug log here
        console.log("Fetched songs:", json.data);

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

  // Update audio when active song changes
  useEffect(() => {
    if (!songs.length) return;
    const currentSong = songs[activeIndex];
    if (!currentSong) return;

    audioManager.setSrc(currentSong.audio);
    if (isPlaying) audioManager.play();

    // change background
    getAverageColorFromImage(currentSong.cover).then((c) => {
      setBgColor(`rgb(${c.r}, ${c.g}, ${c.b})`);
    });

    // duration
    audioManager.audio.onloadedmetadata = () => {
      setDuration(audioManager.getDuration());
    };
  }, [activeIndex, songs]);

  // Listen to time updates
  useEffect(() => {
    audioManager.onTimeUpdate = (time) => setPosition(time);
    audioManager.onEnded = () => handleNext();
  }, []);

  // Handlers
  const handlePlayPause = () => {
    if (isPlaying) {
      audioManager.pause();
    } else {
      audioManager.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setActiveIndex((i) => (i + 1) % songs.length);
  };

  const handlePrev = () => {
    setActiveIndex((i) => (i - 1 + songs.length) % songs.length);
  };

  const handleSeek = (e) => {
    const t = Number(e.target.value);
    audioManager.seek(t);
    setPosition(t);
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
    <div
      className="min-h-screen w-full p-6 text-white transition-colors duration-500"
      style={{
        background: `linear-gradient(135deg, ${bgColor}, #000)`,
      }}
    >
      {/* Header / Search / Tabs */}
      <SearchTabs tab={tab} setTab={setTab} query={query} setQuery={setQuery} />

      <main className="grid md:grid-cols-3 gap-6 items-start">
        {/* Left: Player Controls */}
        <PlayerControls
          song={filteredSongs.length > 0 ? filteredSongs[activeIndex] : null}
          isPlaying={isPlaying}
          handlePlayPause={handlePlayPause}
          handlePrev={handlePrev}
          handleNext={handleNext}
          handleSeek={handleSeek}
          position={position}
          duration={duration}
          formatTime={formatTime}
          seekerRef={seekerRef}
        />

        {/* Right: Song List */}
        <SongList
          songs={filteredSongs}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          setIsPlaying={setIsPlaying}
          audioManager={audioManager}
          loading={loading}
          formatTime={formatTime}
        />
      </main>
    </div>
  );
}
