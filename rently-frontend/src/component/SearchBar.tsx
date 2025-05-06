import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const navigate = useNavigate();

  const handleSearch = () => {
    const query = new URLSearchParams({
      destination,
      checkIn,
      checkOut,
      guests: guests.toString(),
    }).toString();
    navigate(`/search?${query}`);
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-3 py-4">
      <input
        type="text"
        placeholder="search destination"
        className="rounded-full px-4 py-2 border border-pink-400 text-pink-600 font-medium shadow-sm"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <input
        type="date"
        placeholder="check in"
        className="rounded-full px-4 py-2 border border-pink-400 text-pink-600 font-medium shadow-sm"
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
      />
      <input
        type="date"
        placeholder="check out"
        className="rounded-full px-4 py-2 border border-pink-400 text-pink-600 font-medium shadow-sm"
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
      />
      <input
        type="number"
        min={1}
        placeholder="number of guests"
        className="rounded-full px-4 py-2 border border-pink-400 text-pink-600 font-medium shadow-sm w-[160px]"
        value={guests}
        onChange={(e) => setGuests(parseInt(e.target.value))}
      />
      <button
        onClick={handleSearch}
        className="rounded-full bg-gradient-to-r from-[#B24EFF] to-[#FC56FF] text-white px-4 py-2 shadow-lg"
      >
        🔍
      </button>
    </div>
  );
};

export default SearchBar;
