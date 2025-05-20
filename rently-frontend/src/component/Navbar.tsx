import { Link, useNavigate } from "react-router-dom";
import Logo from "../component/Logo";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setOpen((prev) => !prev);
  const handleLogout = () => {
    navigate("/");
    logout();
  };

  return (
    <nav className="w-full px-6 py-4 bg-white shadow-md flex items-center justify-between">
      <Link to="/">
        <Logo />
      </Link>

      {!user ? (
        <div className="flex gap-3 flex-wrap justify-center items-center">
          <Link to="/register-host">
            <button className="text-white bg-gradient-to-r from-[#B24EFF] to-[#FC56FF] hover:brightness-110 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 transition shadow">
              Start renting your house
            </button>
          </Link>
          <Link to="/register">
            <button className="text-white bg-gradient-to-r from-[#B24EFF] to-[#FC56FF] hover:brightness-110 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 transition shadow">
              Sign Up
            </button>
          </Link>
          <Link to="/login">
            <button className="text-white bg-gradient-to-r from-[#B24EFF] to-[#FC56FF] hover:brightness-110 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 transition shadow">
              Sign In
            </button>
          </Link>
        </div>
      ) : (
        <div className="relative flex items-center gap-4">

          <button
            onClick={toggleDropdown}
            className="text-gray-600 hover:text-purple-600 text-2xl transition"
          >
            <FaUserCircle />
          </button>

          <button
            onClick={handleLogout}
            className="text-white bg-gradient-to-r from-[#B24EFF] to-[#FC56FF] hover:brightness-110 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 transition shadow"
          >
            Log Out
          </button>

          {/* Dropdown Menu */}
          {open && (
            <div className="absolute right-0 top-14 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-52">
              <ul className="py-2 text-sm text-gray-700">
                {user.role === "USER" && (
                  <li>
                    <Link
                      to="/bookings"
                      className="block px-4 py-2 hover:bg-gray-100 transition"
                      onClick={() => setOpen(false)}
                    >
                      My Bookings
                    </Link>
                  </li>
                )}
                {user.role === "HOST" && (
                  <li>
                    <Link
                      to="/host/properties"
                      className="block px-4 py-2 hover:bg-gray-100 transition"
                      onClick={() => setOpen(false)}
                    >
                      My Properties
                    </Link>
                  </li>
                )}
                {user.role === "ADMIN" && (
                  <li>
                    <Link
                      to="/admin/properties"
                      className="block px-4 py-2 hover:bg-gray-100 transition"
                      onClick={() => setOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
