import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-bold text-blue-600">
          Feedback Collection
        </Link>

        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className="hidden md:flex items-center space-x-6">
          {currentUser ? (
            <>
              <Link
                to="/dashboard"
                className={`text-sm font-medium ${
                  isActive("/dashboard")
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Dashboard
              </Link>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  {currentUser.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-red-500"
                >
                  <LogOut size={18} className="mr-1" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-sm font-medium ${
                  isActive("/login")
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`text-sm font-medium ${
                  isActive("/register")
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Register
              </Link>
            </>
          )}
        </nav>

        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-md md:hidden z-50">
            <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
              {currentUser ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`text-sm font-medium p-2 ${
                      isActive("/dashboard")
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600"
                    }`}
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/create-form"
                    className={`text-sm font-medium p-2 ${
                      isActive("/create-form")
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600"
                    }`}
                    onClick={toggleMenu}
                  >
                    Create Form
                  </Link>
                  <div className="border-t border-gray-100 pt-2">
                    <div className="p-2 text-sm font-medium text-gray-700">
                      {currentUser.name}
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className="flex w-full items-center p-2 text-red-500"
                    >
                      <LogOut size={18} className="mr-2" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`text-sm font-medium p-2 ${
                      isActive("/login")
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600"
                    }`}
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`text-sm font-medium p-2 ${
                      isActive("/register")
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600"
                    }`}
                    onClick={toggleMenu}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
