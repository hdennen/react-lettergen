import { Link } from 'react-router-dom';

export const NavBar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img
                className="h-[100px] w-[300px] object-contain"
                src="../../public/img/acehoundlogo2.png" // Replace with your actual logo path
                alt="Company Logo"
              />
            </Link>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">
              Home
            </Link>
            <Link to="/products" className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">
              Products
            </Link>
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
