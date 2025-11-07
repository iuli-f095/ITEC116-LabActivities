import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Posts from "./pages/posts";
import PostDetails from "./pages/post_info";
import CreatePost from "./pages/create_post";
import { useEffect, useState } from "react";

function Navigation() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">BlogPlatform</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">All Posts</Link>
          {user ? (
            <>
              <Link to="/create_post" className="nav-link">Create Post</Link>
              <span className="user-welcome">Welcome, {user.name}</span>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Posts />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create_post" element={<CreatePost />} />
            <Route path="/posts/:id" element={<PostDetails />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;