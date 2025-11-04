import { useEffect, useState } from "react";
import { getPosts } from "../api/posts";
import { Link } from "react-router-dom";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5;

  useEffect(() => {
    getPosts(page).then((res) => {
      setPosts(res.data);
      setTotal(res.total);
    });
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h2>Blog Posts</h2>
      {posts.map((p) => (
        <div key={p.id}>
          <h3>
            <Link to={`/posts/${p.id}`}>{p.title}</Link>
          </h3>
          <p>{p.content.slice(0, 100)}...</p>
          <hr />
        </div>
      ))}

      <div>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span> Page {page} of {totalPages} </span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
