const API_URL = import.meta.env.VITE_API_URL

const handleResponse = async (response) => {
  if (!response.ok) {
    try {
      const error = await response.json()
      throw new Error(error.message || 'Something went wrong')
    } catch (e) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  }
  return response.json()
}

const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  }
}

export const authAPI = {
  login: async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    return handleResponse(response)
  },

  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    return handleResponse(response)
  },
}

export const movieAPI = {
  getAllMovies: async () => {
    const response = await fetch(`${API_URL}/movies`)
    return handleResponse(response)
  },

  getMovieById: async (id) => {
    const response = await fetch(`${API_URL}/movies/${id}`)
    return handleResponse(response)
  },

  createMovie: async (data) => {
    const response = await fetch(`${API_URL}/movies`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  updateMovie: async (id, data) => {
    const response = await fetch(`${API_URL}/movies/${id}`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  deleteMovie: async (id) => {
    const response = await fetch(`${API_URL}/movies/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    })
    return handleResponse(response)
  },

  searchTMDB: async (query) => {
    const response = await fetch(`${API_URL}/movies/tmdb/search?query=${encodeURIComponent(query)}`)
    return handleResponse(response)
  },

  seedFromTMDB: async (tmdbId) => {
    const response = await fetch(`${API_URL}/movies/tmdb/seed/${tmdbId}`, {
      method: 'POST',
      headers: getAuthHeader(),
    })
    return handleResponse(response)
  },

  getPopularMovies: async () => {
    const response = await fetch(`${API_URL}/movies/tmdb/popular`)
    return handleResponse(response)
  },

  getTMDBDetails: async (tmdbId) => {
    const response = await fetch(`${API_URL}/movies/tmdb/details/${tmdbId}`)
    return handleResponse(response)
  },
}

export const reviewAPI = {
  getMovieReviews: async (movieId) => {
    const response = await fetch(`${API_URL}/reviews/movie/${movieId}`)
    return handleResponse(response)
  },

  createReview: async (data) => {
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  updateReview: async (id, data) => {
    const response = await fetch(`${API_URL}/reviews/${id}`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  updateReview: async (id, data) => {
    const response = await fetch(`${API_URL}/reviews/${id}`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  getUserReviews: async () => {
    const response = await fetch(`${API_URL}/reviews/user`, {
      headers: getAuthHeader(),
    })
    return handleResponse(response)
  },
}