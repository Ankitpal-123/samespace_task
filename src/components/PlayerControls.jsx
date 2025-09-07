// src/components/PlayerControls.jsx
import React, { useState, useEffect } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { HiMiniSpeakerXMark } from "react-icons/hi2";
import { GiSpeaker } from "react-icons/gi";
import Left_icon from "../assets/left-icon.png";
import Pause from "../assets/Pause_player.png";
import Play from "../assets/Play_player.png";
import Right from "../assets/Right_icon.png";

const PlayerControls = ({
  audioManager,
  song,
  isPlaying,
  handlePlayPause,
  handlePrev,
  handleNext,
  handleSeek,
  position,
  duration,
  formatTime,
  seekerRef,
}) => {
  const [isMuted, setIsMuted] = useState(() =>
    audioManager ? audioManager.isMuted() : false
  );

  // Sync local state if audioManager changes
  useEffect(() => {
    if (!audioManager) return;
    setIsMuted(!!audioManager.isMuted());
  }, [audioManager]);

  const handleMuteToggle = () => {
    if (!audioManager) return;
    audioManager.toggleMute();
    setIsMuted(audioManager.isMuted());
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col">
        <h1 className="text-xl sm:text-2xl md:text-[32px] font-[700] text-white truncate">
          {song?.title || "—"}
        </h1>
        <p className="text-sm sm:text-base md:text-[16px] text-white/70 truncate">
          {song?.artist || "—"}
        </p>
      </div>

      <div>
        <div className="rounded-xl overflow-hidden shadow-lg border border-white/10 mx-auto">
          {song?.cover ? (
            <img
              src={song.cover}
              alt="cover"
              className="playercontroller w-[350px] h-[350px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/60">
              No Cover
            </div>
          )}
        </div>

        <div className="w-full">
          <div className="mt-4">
            <input
              ref={seekerRef}
              type="range"
              min={0}
              max={duration || 0}
              value={position}
              step={0.01}
              onChange={handleSeek}
              onInput={handleSeek}
              className="player-range w-full"
            />

            <div className="flex justify-between text-xs text-white/70 mt-1">
              <span>{formatTime(position)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="mt-4 w-full flex items-center justify-between gap-6">
            <HiOutlineDotsHorizontal className="h-10 w-10 p-2 bg-white/5 rounded-full" />

            <div className="flex">
              <button onClick={handlePrev} className="p-3">
                <img src={Left_icon} alt="Previous" />
              </button>

              <button
                onClick={handlePlayPause}
                className="px-5 py-3 rounded-full text-black font-semibold"
              >
                {isPlaying ? (
                  <img src={Pause} alt="Pause" className="h-12 w-12" />
                ) : (
                  <img src={Play} alt="Play" className="h-12 w-12" />
                )}
              </button>

              <button onClick={handleNext} className="p-3">
                <img src={Right} alt="Next" />
              </button>
            </div>

            <button
              onClick={handleMuteToggle}
              className="h-10 w-10 p-2 bg-white/5 rounded-full flex items-center justify-center"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <HiMiniSpeakerXMark className="h-6 w-6" />
              ) : (
                <GiSpeaker className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlayerControls;
