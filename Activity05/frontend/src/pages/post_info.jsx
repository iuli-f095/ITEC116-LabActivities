import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../api/posts";
import { getComments, addComment } from "../api/comments";

export default function PostInfos() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    getPost(id).then(setPost);
    getComments(id).then(setComments);
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await addComment(id, { content: commentText }, token);
    setCommentText("");
    setComments(await getComments(id));
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>

      <hr />
      <h3>Comments</h3>
      {comments.map((c) => (
        <p key={c.id}>💬 {c.content}</p>
      ))}

      <form onSubmit={handleComment}>
        <input
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button type="submit">Comment</button>
      </form>
    </div>
  );
}
