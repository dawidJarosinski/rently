import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

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
    <div className="w-full flex justify-center py-6">
      <div className="flex flex-wrap md:flex-nowrap items-center bg-white rounded-full shadow-lg border border-pink-300 overflow-hidden w-full max-w-4xl">
        <input
          type="text"
          placeholder="Gdzie chcesz jechać?"
          className="flex-1 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <div className="w-full md:w-px h-px md:h-8 bg-pink-200 mx-2 hidden md:block" />
        <input
          type="date"
          className="px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />
        <input
          type="date"
          className="px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />
        <input
          type="number"
          min={1}
          className="w-20 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
          placeholder="Goście"
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
        />
        <button
          onClick={handleSearch}
          className="bg-gradient-to-r from-[#B24EFF] to-[#FC56FF] text-white p-3 rounded-full flex items-center justify-center hover:scale-105 transition w-12 h-12 m-2"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
