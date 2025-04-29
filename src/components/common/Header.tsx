import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from './Button';
import useUserStore from '../../store/userStore';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useUserStore();
  const location = useLocation();
  
  const isDepartment = location.pathname.startsWith('/department');

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
            <img src="/namma_logo.png" alt="logo" className="h-10 w-auto"/>
              {/* <Shield className="h-8 w-8 text-blue-900" /> */}
              <span className="ml-2 text-xl font-bold text-blue-900">Namma Suraksha</span>
            </Link>
            
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link 
                to="/" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === '/' 
                    ? 'border-blue-900 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Home
              </Link>
              
              {isAuthenticated && (
                <Link 
                  to="/report" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/report' 
                      ? 'border-blue-900 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Report Crime
                </Link>
              )}
            </nav>
          </div>
          
          <div className="hidden md:ml-6 md:flex md:items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Hello, {user?.name}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/auth">
                  <Button variant="primary" size="sm">
                    Sign In / Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                location.pathname === '/'
                  ? 'bg-blue-50 border-blue-900 text-blue-900'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {isAuthenticated && (
              <Link
                to="/report"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  location.pathname === '/report'
                    ? 'bg-blue-50 border-blue-900 text-blue-900'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Report Crime
              </Link>
            )}
            
            <Link
              to="/department"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isDepartment
                  ? 'bg-blue-50 border-blue-900 text-blue-900'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Department
            </Link>
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="space-y-3 px-4">
                <div className="flex items-center">
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user?.name}</div>
                    <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="px-4 py-2">
                <Link
                  to="/auth"
                  className="block text-center px-4 py-2 text-base font-medium text-white bg-blue-900 rounded-md hover:bg-blue-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In / Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;