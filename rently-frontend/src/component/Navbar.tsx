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
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full flex justify-between items-center p-4 bg-white shadow">
      <Logo />

      {!user ? (
        <div className="flex gap-4">
          <Link to="/register-host">
            <button type="button" className="text-white bg-gradient-to-r from-[#B24EFF] to-[#FC56FF] hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 shadow-lg shadow-purple-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
              Start renting your house
            </button>
          </Link>
          <Link to="/register/user">
            <button type="button" className="text-white bg-gradient-to-r from-[#B24EFF] to-[#FC56FF] hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 shadow-lg shadow-purple-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
              Sign Up
            </button>
          </Link>
          <Link to="/login">
            <button type="button" className="text-white bg-gradient-to-r from-[#B24EFF] to-[#FC56FF] hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 shadow-lg shadow-purple-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
              Sign In
            </button>
          </Link>
        </div>
      ) : (
        <div className="relative flex items-center gap-4">
          <button
            onClick={toggleDropdown}
            className="text-gray-700 text-2xl hover:text-purple-600 transition"
          >
            <FaUserCircle />
          </button>
          <button
            onClick={handleLogout}
            className="text-white bg-gradient-to-r from-[#B24EFF] to-[#FC56FF] hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 shadow-lg shadow-purple-500/50 font-medium rounded-lg text-sm px-4 py-2.5 text-center mb-2"
          >
            Log Out
          </button>

          {open && (
            <div className="absolute right-0 top-12 bg-white shadow-lg border border-gray-200 rounded-lg w-48 z-10">
              <ul className="py-2 text-sm text-gray-700">
                {user.role === "USER" && (
                  <li>
                    <Link
                      to="/reservations"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      My Reservations
                    </Link>
                  </li>
                )}
                {user.role === "HOST" && (
                  <li>
                    <Link
                      to="/host/properties"
                      className="block px-4 py-2 hover:bg-gray-100"
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
                      className="block px-4 py-2 hover:bg-gray-100"
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
