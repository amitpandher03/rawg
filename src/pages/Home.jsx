import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaStar, FaArrowRight } from 'react-icons/fa'
import InfiniteScroll from '../components/Features/InfiniteScroll'


const Home = () => {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const API_KEY = import.meta.env.VITE_RAWG_API_KEY

  const fetchGames = async (pageNumber) => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${API_KEY}&page=${pageNumber}&page_size=12`
      )
      const data = await response.json()
      
      if (pageNumber === 1) {
        setGames(data.results)
      } else {
        setGames(prev => [...prev, ...data.results])
      }
      
      setHasMore(data.next !== null)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching games:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGames(1)
  }, [])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchGames(nextPage)
  }

  return (
    <>
      <div className="relative mt-3 mb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-pink-900/90 z-10" />
        <img
          src="/hero-bg.jpg"
          alt="Hero Background"
          className="w-full h-[600px] object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Discover Your Next Gaming Adventure
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Explore thousands of games, read reviews, and join a community of gamers passionate about great gaming experiences.
            </p>
            <Link
              to="/categories"
              className="inline-flex items-center px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 text-lg font-medium"
            >
              Explore Games
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    
      <InfiniteScroll
        loadMore={loadMore}
        hasMore={hasMore}
        loading={loading}
      >
        <h1 className="text-4xl font-bold mb-8">Trending Games</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link to={`/game/${game.id}`} key={game.id}>
              <div className="group relative bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-purple-500/25">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10" />
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h2 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                    {game.name}
                  </h2>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-400">
                        <FaStar className="mr-1" />
                        {game.rating}/5
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">
                      {new Date(game.released).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </InfiniteScroll>
    </>
  )
}

export default Home 