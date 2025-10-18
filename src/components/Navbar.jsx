import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { SearchContext } from "../context/SearchContext";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

function Navbar() {
  const { token, role, logout } = useContext(AuthContext);
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [searchVisible, setSearchVisible] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isAuthPage = location.pathname === "/" || location.pathname === "/register";

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-md sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link
          to={token ? "/dashboard" : "/"}
          className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition"
        >
          StudyHub
        </Link>

        {token && !isAuthPage && (
          <>
            <Link to="/dashboard" className="hover:text-blue-400 transition">
              Dashboard
            </Link>
           
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {token && !isAuthPage && (
          <div className="relative flex items-center">
            <button
              onClick={() => setSearchVisible(!searchVisible)}
              className="hover:text-blue-400 transition"
            >
              <Search size={22} />
            </button>

            <AnimatePresence>
              {searchVisible && (
                <motion.input
                  key="search-input"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search folders & notes..."
                  className="ml-2 px-3 py-1 rounded-lg text-black bg-amber-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              )}
            </AnimatePresence>
          </div>
        )}

        <a
          href="https://www.instagram.com/ordinary_vk/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-500 transition"
        >
          Instagram
        </a>
        <a
          href="https://www.youtube.com/@javawithvk"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-red-500 transition"
        >
          YouTube
        </a>

        {token && !isAuthPage ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/" className="mr-3 hover:text-blue-400 transition">
              Login
            </Link>
            <Link to="/register" className="hover:text-blue-400 transition">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
