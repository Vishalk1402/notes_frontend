import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { SearchContext } from "../context/SearchContext";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X } from "lucide-react";

function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [searchVisible, setSearchVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isAuthPage = location.pathname === "/" || location.pathname === "/register";

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 shadow-md sticky top-0 z-50">
      {/* Top Navbar Section */}
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link
          to={token ? "/dashboard" : "/"}
          className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition md:text-left text-center w-full md:w-auto"
        >
          StudyHub
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden focus:outline-none absolute right-6"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-4">
          {token && !isAuthPage && (
            <>
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

              <Link to="/dashboard" className="hover:text-blue-400 transition">
                Dashboard
              </Link>
            </>
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
              <Link to="/" className="hover:text-blue-400 transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-blue-400 transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden flex flex-col items-center gap-4 mt-4 text-center"
          >
            {token && !isAuthPage && (
              <>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search folders & notes..."
                  className="px-3 py-1 rounded-lg text-black bg-amber-50 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full max-w-xs"
                />
                <Link
                  to="/dashboard"
                  className="hover:text-blue-400 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </>
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
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition w-full max-w-xs"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/"
                  className="hover:text-blue-400 transition w-full"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hover:text-blue-400 transition w-full"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
