import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { addComment, getComments, deleteComment } from '../../utils/firebaseComments'

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
            placeholder="Add a comment..."
            className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows="3"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post Comment
          </button>
        </form>
      ) : (
        <div className="text-center p-4 bg-gray-800 rounded-lg">
          Please login to leave a comment.
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium text-purple-400">
                {comment.userEmail}
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
                {user?.email === comment.userId && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-300">{comment.text}</p>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  )
}

export default Comments 