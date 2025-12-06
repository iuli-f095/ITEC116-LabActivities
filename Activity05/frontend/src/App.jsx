import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/authContext';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Profile from './pages/profile';
import CreatePostPage from './pages/createpostpage';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ backgroundColor: '#FFF8DE', minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/profile" 
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/create-post" 
          element={isAuthenticated ? <CreatePostPage /> : <Navigate to="/login" />} 
        />
      </Routes>
    </div>
  );
}

export default App;