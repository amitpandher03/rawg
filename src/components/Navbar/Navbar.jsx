import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useState } from 'react'
import AutoCompleteCardUi from '../AutoCompleteCardUi'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  // Get username from email
  const username = user?.email?.split('@')[0] || ''

  const handleLogout = async () => {
    try {
      await logout()
      setIsOpen(false)
      setIsMobileMenuOpen(false)
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold">
            GameVault
          </Link>

          {/* Search - Hidden on mobile */}
          <div className="hidden md:block flex-1 max-w-xl mx-6">
            <AutoCompleteCardUi />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/trending" className="hover:text-purple-400 transition-colors">
              Trending
            </Link>
            <Link to="/categories" className="hover:text-purple-400 transition-colors">
              Categories
            </Link>
            <Link to="/favorites" className="hover:text-purple-400 transition-colors">
              Favorites
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="hover:text-purple-400 transition-colors"
                >
                  {user.displayName || username}
                </button>

                {isOpen && (
                  <div className="absolute right-0 mt-2 w-64 py-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="font-medium">{username}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left hover:bg-gray-700 text-red-400"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-700 rounded-lg"
          >
            <div className="w-6 h-0.5 bg-white mb-1.5"></div>
            <div className="w-6 h-0.5 bg-white mb-1.5"></div>
            <div className="w-6 h-0.5 bg-white"></div>
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <AutoCompleteCardUi />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-4">
              {user && (
                <div className="px-4 py-2 border-b border-gray-700">
                  <p className="font-medium">{username}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              )}
              <Link 
                to="/trending" 
                className="px-4 py-2 hover:bg-gray-700 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trending
              </Link>
              <Link 
                to="/categories" 
                className="px-4 py-2 hover:bg-gray-700 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                to="/favorites" 
                className="px-4 py-2 hover:bg-gray-700 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Favorites
              </Link>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-left hover:bg-gray-700 rounded-lg text-red-400"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar 