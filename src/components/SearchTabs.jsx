import React from "react";
import { CiSearch } from "react-icons/ci";

const SearchTabs = ({ tab, setTab, query, setQuery }) => {
  return (
    <>
      <div className="w-98 mb-6">
        <nav className="flex gap-12 text-sm mb-3">
          <button
            className={`y-1 cursor-pointer text-[24px] font-bold ${
              tab === "foryou" ? "text-white" : "text-white/20"
            }`}
            onClick={() => setTab("foryou")}
          >
            For You
          </button>
          <button
            className={` py-1 cursor-pointer text-[24px] font-bold ${
              tab === "top" ? "text-white" : "text-white/20"
            }`}
            onClick={() => setTab("top")}
          >
            Top Tracks
          </button>
        </nav>

        <div className="w-[90%] h-[48px] flex ali items-center bg-white/6 rounded-lg px-3 py-1 ">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Song, Artist"
            className="bg-transparent px-2 outline-none text-white placeholder:text-white/50 w-48 line md:w-72"
          />
          <CiSearch className="text-2xl" />
        </div>
      </div>
    </>
  );
};

export default SearchTabs;
