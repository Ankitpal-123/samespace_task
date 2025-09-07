import React from "react";
import { CiSearch } from "react-icons/ci";

const SearchTabs = ({ tab, setTab, query, setQuery }) => {
  return (
    <>
      <div className="w-full mb-4 sm:mb-6">
        <nav className="flex gap-6 sm:gap-12 text-sm mb-3">
          <button
            className={`cursor-pointer text-lg sm:text-[24px] font-bold ${
              tab === "foryou" ? "text-white" : "text-white/20"
            }`}
            onClick={() => setTab("foryou")}
          >
            For You
          </button>
          <button
            className={` py-1 cursor-pointer sm:text-[24px] text-[24px] font-bold ${
              tab === "top" ? "text-white" : "text-white/20"
            }`}
            onClick={() => setTab("top")}
          >
            Top Tracks
          </button>
        </nav>

        <div className="w-full h-[42px] sm:h-[48px] flex items-center bg-white/6 rounded-lg px-3 py-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Song, Artist"
            className="bg-transparent px-2 outline-none text-white placeholder:text-white/50 w-full text-sm sm:text-base"
          />
          <CiSearch className="text-xl sm:text-2xl" />
        </div>
      </div>
    </>
  );
};

export default SearchTabs;
