import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import ReviewCard from '../components/reviews/ReviewCard'
import ReviewForm from '../components/reviews/ReviewForm'
import { FaStar, FaFilm, FaPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { reviewAPI, movieAPI } from '../api'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const { user } = useAuth()
  const [userReviews, setUserReviews] = useState([])
  const [editingReview, setEditingReview] = useState(null)
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    favoriteGenre: 'N/A'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const reviews = await reviewAPI.getUserReviews()
      const movies = await movieAPI.getAllMovies()

      setUserReviews(reviews)

      // Calculate stats
      const totalReviews = reviews.length
      const averageRating = totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0

      setStats({
        totalReviews,
        averageRating,
        favoriteGenre: 'N/A'
      })
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewAPI.deleteReview(reviewId)
        toast.success('Review deleted successfully')
        fetchUserData()
      } catch (error) {
        toast.error('Failed to delete review')
      }
    }
  }

  const handleEditReview = (review) => {
    setEditingReview(review)
  }

  const handleCancelEdit = () => {
    setEditingReview(null)
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
      }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          border: '2px solid #764ba2',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}></div>
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: 'white', marginBottom: '2rem' }}>Dashboard</h1>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card-dark" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaFilm style={{ color: '#764ba2', fontSize: '1.5rem', marginRight: '0.75rem' }} />
            <div>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Total Reviews</p>
              <p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalReviews}</p>
            </div>
          </div>
        </div>

        <div className="card-dark" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaStar style={{ color: '#fbbf24', fontSize: '1.5rem', marginRight: '0.75rem' }} />
            <div>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Average Rating</p>
              <p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.averageRating.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="card-dark" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaPlus style={{ color: '#10b981', fontSize: '1.5rem', marginRight: '0.75rem' }} />
            <div>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Favorite Genre</p>
              <p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.favoriteGenre}</p>
            </div>
          </div>
        </div>
      </div>

      {/* User's Reviews */}
      <div className="card-dark" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>My Reviews</h2>

        {userReviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>You haven't reviewed any movies yet.</p>
            <Link
              to="/"
              style={{
                backgroundColor: '#764ba2',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
              }}
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {userReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onDelete={handleDeleteReview}
                onEdit={handleEditReview}
                showMovie={true}
                currentUserId={user?.id}
              />
            ))}
          </div>
        )}

        {editingReview && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              Edit Review
            </h3>
            <ReviewForm
              movieId={editingReview.movie_id}
              onReviewAdded={() => {
                fetchUserData();
                setEditingReview(null);
              }}
              editReview={editingReview}
              onCancelEdit={handleCancelEdit}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard