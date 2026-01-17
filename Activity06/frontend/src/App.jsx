import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import MoviePage from './pages/MoviePage'
import SearchResults from './pages/SearchResults'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Header />
        <main className="app-main app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/movie/:id" element={<MoviePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App