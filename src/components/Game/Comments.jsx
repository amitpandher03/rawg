import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { addComment, getComments, deleteComment } from '../../utils/firebaseComments'
import { Link } from 'react-router-dom'
import { FaTrash, FaComments } from 'react-icons/fa'

const Comments = ({ gameId }) => {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    loadComments()
  }, [gameId])

  const loadComments = async () => {
    try {
      const gameComments = await getComments(gameId)
      setComments(gameComments)
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || !newComment.trim()) return

    try {
      await addComment(user.email, gameId, newComment.trim())
      setNewComment('')
      loadComments() // Reload comments after adding
    } catch (error) {
      console.error('Error submitting comment:', error)
    }
  }

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId)
      loadComments() // Reload comments after deletion
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="animate-pulse bg-gray-800 p-4 rounded-lg">
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-2" />
            <div className="h-4 bg-gray-700 rounded w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this game..."
            className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 
            rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
            resize-none transition-all duration-300"
            rows="3"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 
              hover:from-purple-700 hover:to-pink-700 rounded-xl transition-all duration-300 
              disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 
              active:scale-95 font-medium"
            >
              Post Comment
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl">
          <p className="text-lg mb-4">Please login to join the discussion</p>
          <Link 
            to="/login"
            className="inline-flex px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 
            hover:from-purple-700 hover:to-pink-700 rounded-xl transition-all duration-300 
            transform hover:scale-105 font-medium"
          >
            Login
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div 
            key={comment.id} 
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-xl 
            hover:border-purple-500/50 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full 
                flex items-center justify-center text-sm font-bold">
                  {comment.userEmail[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-medium bg-gradient-to-r from-purple-400 to-pink-400 
                  bg-clip-text text-transparent">
                    {comment.userEmail}
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              {user?.email === comment.userId && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors duration-300"
                >
                  <FaTrash className="text-sm" />
                </button>
              )}
            </div>
            <p className="text-gray-300 leading-relaxed">{comment.text}</p>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <FaComments className="text-4xl mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No comments yet</p>
            <p className="text-sm">Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Comments