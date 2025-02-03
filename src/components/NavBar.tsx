import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/img/acehoundlogo2.png';

export const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img
                className="h-[100px] w-[300px] object-contain"
                src={logo}
                alt="ACEHOUND - Access Correspondence Expert"
              />
            </Link>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">
              Home
            </Link>
            
            {isAuthenticated ? (
              <div className="relative group">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <svg
                    className="h-6 w-6 text-gray-700"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
                <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out transform">
                  <div className="h-2 -mt-2"></div>
                  <div className="py-2">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
