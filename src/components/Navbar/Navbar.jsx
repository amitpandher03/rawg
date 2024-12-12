import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSearch, FaGamepad, FaUser, FaHeart, FaBars, FaTimes } from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'
import AutoCompleteCardUi from '../AutoCompleteCardUi'

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchTermState, setSearchTermState] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    if (e.key === 'Enter' || e.type === 'submit') {
      e.preventDefault()
      const newSearchTerm = searchTermState.trim()
      if (newSearchTerm && newSearchTerm !== '') {
        try {
          const response = await fetch(`https://api.rawg.io/api/games?key=${import.meta.env.VITE_RAWG_API_KEY}&search=${encodeURI(newSearchTerm)}`)
          const data = await response.json()
          const results = data.results;
          console.log('results', results);
  
          navigate(`/search?q=${newSearchTerm}`);
          console.log(newSearchTerm);
  
          setIsMenuOpen(false)
          setSearchTerm('')
          setSearchTermState('')

        } catch (error) {
          console.error('Errore durante la ricerca dei giochi:', error)
        }
      }
    }
  }
  
  // Aggiorna il valore di searchTermState quando il valore di searchTerm cambia
  useEffect(() => {
    setSearchTermState(searchTerm)
  }, [searchTerm])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
      setIsMenuOpen(false)
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo with animation */}
          <Link to="/" className="flex items-center space-x-3 group">
            <FaGamepad className="text-3xl text-purple-500 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              ReHacktor
            </span>
          </Link>

          {/* Search Bar with glass effect */}
          <AutoCompleteCardUi />

          {/* Navigation Links with hover effects */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/categories"
              className="relative group"
            >
              <span className="text-gray-300 hover:text-white transition-colors">Categories</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300"></span>
            </Link>

            <Link
              to="/trending"
              className="relative group"
            >
              <span className="text-gray-300 hover:text-white transition-colors">Trending</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {user ? (
              <>
                <Link to="/favorites" className="hover:text-purple-500">
                  <FaHeart className="text-xl" />
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-1 hover:text-purple-500">
                    <FaUser />
                    <span>{user.username || 'Profile'}</span>
                  </button>
                  <div className="absolute right-0 w-48 py-2 mt-2 bg-gray-800 rounded-lg shadow-xl hidden group-hover:block">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-700"
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-red-400"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 pb-4 px-4">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onBlur={() => setSearchTermState(searchTerm)}
                onKeyDown={handleSearch}
                placeholder="Search games..."
                className="w-full mt-4 px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" 
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <FaSearch className='mt-4' />
              </button>
            </div>
          </form>

          <div className="space-y-4">
            <Link
              to="/categories"
              className="block hover:text-purple-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              to="/trending"
              className="block hover:text-purple-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Trending
            </Link>

            {user ? (
              <>
                <Link
                  to="/favorites"
                  className="block hover:text-purple-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Favorites
                </Link>
                <Link
                  to="/profile"
                  className="block hover:text-purple-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-400 hover:text-red-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block hover:text-purple-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar 