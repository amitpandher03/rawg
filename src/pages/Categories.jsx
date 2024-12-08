import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaGamepad, FaArrowRight } from 'react-icons/fa'

const Categories = () => {
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const API_KEY = import.meta.env.VITE_RAWG_API_KEY

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.rawg.io/api/genres?key=${API_KEY}`
        )
        const data = await response.json()
        setGenres(data.results)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching genres:', error)
        setLoading(false)
      }
    }

    fetchGenres()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="h-80 bg-gray-800/50 rounded-2xl animate-pulse">
            <div className="h-full bg-gradient-to-br from-gray-800 to-gray-700" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Game Categories
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Explore different gaming genres and discover your next favorite game
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {genres.map((genre) => (
          <Link 
            to={`/search?genre=${genre.slug}`} 
            key={genre.id}
            className="group relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-purple-500/50 transition-colors duration-300"
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent z-10" />
              <img
                src={genre.image_background}
                alt={genre.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Content */}
            <div className="relative z-20 p-6 h-full flex flex-col justify-end">
              <div className="space-y-4">
                {/* Icon and Title */}
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <FaGamepad className="text-2xl text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold group-hover:text-purple-400 transition-colors">
                    {genre.name}
                  </h2>
                </div>

                {/* Stats and Popular Games */}
                <div className="space-y-3">
                  <p className="text-gray-400">
                    {genre.games_count.toLocaleString()} games available
                  </p>
                  <div className="text-sm text-gray-500">
                    Popular: {genre.games.slice(0, 3).map(game => game.name).join(', ')}
                  </div>
                </div>

                {/* Explore Button */}
                <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
                  <span className="mr-2">Explore Genre</span>
                  <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-12 py-12 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl backdrop-blur-sm">
        <h3 className="text-2xl font-bold mb-4">
          Can't find what you're looking for?
        </h3>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
        >
          Search All Games
          <FaArrowRight className="ml-2" />
        </Link>
      </div>
    </div>
  )
}

export default Categories 