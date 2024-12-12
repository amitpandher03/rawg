import { useState, useEffect } from 'react'
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa'

// eslint-disable-next-line react/prop-types
const ScreenshotsGallery = ({ gameId }) => {
  const [screenshots, setScreenshots] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const API_KEY = import.meta.env.VITE_RAWG_API_KEY

  useEffect(() => {
    const fetchScreenshots = async () => {
      try {
        const response = await fetch(
          `https://api.rawg.io/api/games/${gameId}/screenshots?key=${API_KEY}`
        )
        const data = await response.json()
        setScreenshots(data.results)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching screenshots:', error)
        setLoading(false)
      }
    }

    fetchScreenshots()
  }, [gameId])

  const handlePrevious = () => {
    const currentIndex = screenshots.findIndex(img => img.id === selectedImage.id)
    const previousIndex = (currentIndex - 1 + screenshots.length) % screenshots.length
    setSelectedImage(screenshots[previousIndex])
  }

  const handleNext = () => {
    const currentIndex = screenshots.findIndex(img => img.id === selectedImage.id)
    const nextIndex = (currentIndex + 1) % screenshots.length
    setSelectedImage(screenshots[nextIndex])
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="h-48 bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]">
        {screenshots.map((screenshot, index) => (
          <div
            key={screenshot.id}
            className={`cursor-pointer overflow-hidden rounded-xl group relative
              ${index % 3 === 0 ? 'row-span-2' : ''}`}
            onClick={() => setSelectedImage(screenshot)}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
            <img
              src={screenshot.image}
              alt="Game Screenshot"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <span className="text-sm font-medium">Click to view</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal with zoom effect */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-7xl px-4 animate-fade-in">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <FaTimes size={24} />
            </button>
            
            <img
              src={selectedImage.image}
              alt="Game Screenshot"
              className="w-full h-auto rounded-lg shadow-2xl"
            />

            <div className="absolute left-4 right-4 bottom-4 flex justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrevious()
                }}
                className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              >
                <FaArrowLeft size={20} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              >
                <FaArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ScreenshotsGallery 