import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';
import logo from '../assets/img/acehoundlogo2.png';

export const NavBar = () => {
  const { isAuthenticated, login, logout, user } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
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
          </div>
          
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  {user?.email}
                </span>
                <Link
                  to="/profile/setup"
                  className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  <User className="h-5 w-5 mr-1" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => login()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
