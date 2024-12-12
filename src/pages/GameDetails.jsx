import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FaStar, FaExternalLinkAlt } from 'react-icons/fa'
import LoadingSkeleton from '../components/Features/LoadingSkeleton'
import ScreenshotsGallery from '../components/Game/ScreenshotsGallery'
import GameAchievements from '../components/Game/GameAchievements'

const GameDetails = () => {
  const { id } = useParams()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await fetch(
          `https://api.rawg.io/api/games/${id}?key=${API_KEY}`
        )
        const data = await response.json()
        setGame(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching game details:', error)
        setLoading(false)
      }
    }

    fetchGameDetails()
  }, [id])

  if (loading) {
    return <LoadingSkeleton type="detail" />
  }

  if (!game) {
    return <div className="text-center text-2xl">Game not found</div>
  }

  return (
    <div className="max-w-7xl mx-auto -mt-8">
      <div className="relative h-[70vh] mb-12">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent z-10" />
        <img
          src={game.background_image}
          alt={game.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              {game.name}
            </h1>
            <div className="flex items-center space-x-6 text-lg">
              <div className="flex items-center space-x-2">
                <FaStar className="text-yellow-500" />
                <span className="font-medium">{game.rating}/5</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-purple-400">Released:</span>
                <span>{new Date(game.released).toLocaleDateString()}</span>
              </div>
              {game.metacritic && (
                <div className={`px-4 py-1 rounded-full font-medium
                  ${game.metacritic >= 80 ? 'bg-green-500/20 text-green-400' : 
                    game.metacritic >= 60 ? 'bg-yellow-500/20 text-yellow-400' : 
                    'bg-red-500/20 text-red-400'}`}>
                  Metacritic: {game.metacritic}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              About
            </h2>
            <p className="text-gray-300 leading-relaxed">{game.description_raw}</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Screenshots
            </h2>
            <ScreenshotsGallery gameId={id} />
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Achievements
            </h2>
            <GameAchievements gameId={id} />
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 sticky top-24">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-400 mb-3">Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {game.platforms?.map((platform) => (
                    <span
                      key={platform.platform.id}
                      className="px-3 py-1 rounded-full text-sm bg-gray-700/50 border border-gray-600"
                    >
                      {platform.platform.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-400 mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {game.genres?.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 rounded-full text-sm bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              {game.website && (
                <div>
                  <h3 className="text-lg font-medium text-gray-400 mb-3">Website</h3>
                  <a
                    href={game.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                  >
                    Visit Website
                    <FaExternalLinkAlt className="ml-2 text-sm" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameDetails 