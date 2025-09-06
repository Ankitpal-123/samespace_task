import Spotify_logo from "../assets/Spotify_logo.png";
import Profile_logo from "../assets/Profile.png";
import Profile from "../assets/Profile.jpeg";

const Leftcomponent = () => {
  return (
    <>
      <img
        src={Spotify_logo}
        alt="Spotify logo"
        className="h-[40px] w-[133px]"
      />
      <img
        src={Profile}
        alt="Profile logo"
        className="h-[48px] w-[48px] rounded-full"
      />
    </>
  );
};

export default Leftcomponent;
