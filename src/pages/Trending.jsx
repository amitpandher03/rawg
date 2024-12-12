import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import GameFilter from '../components/Game/GameFilter'
import { FaStar, FaFire } from 'react-icons/fa'

const Trending = () => {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    platform: '',
    sort: '-rating',
    metacritic: ''
  })
  
  const API_KEY = import.meta.env.VITE_RAWG_API_KEY

  useEffect(() => {
    const fetchTrendingGames = async () => {
      setLoading(true)
      try {
        let url = `https://api.rawg.io/api/games?key=${API_KEY}&ordering=${filters.sort}&page_size=18`
        
        if (filters.platform) {
          url += `&platforms=${filters.platform}`
        }
        
        if (filters.metacritic) {
          const [min, max] = filters.metacritic.split(',')
          url += `&metacritic=${min},${max}`
        }

        const response = await fetch(url)
        const data = await response.json()
        setGames(data.results)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching trending games:', error)
        setLoading(false)
      }
    }

    fetchTrendingGames()
  }, [filters])

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const handleSortChange = (value) => {
    setFilters(prev => ({
      ...prev,
      sort: value
    }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <FaFire className="text-3xl text-orange-500" />
        <h1 className="text-4xl font-bold">Trending Games</h1>
      </div>

      <GameFilter 
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        currentFilters={filters}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Link to={`/game/${game.id}`} key={game.id}>
            <div className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-200">
              <div className="relative">
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="w-full h-48 object-cover"
                />
                {game.metacritic && (
                  <span className={`absolute top-2 right-2 px-2 py-1 rounded text-sm font-bold
                    ${game.metacritic >= 80 ? 'bg-green-500' : 
                      game.metacritic >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                    {game.metacritic}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{game.name}</h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-500 mr-1" />
                    <span>{game.rating}/5</span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    Released: {game.released}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Trending 