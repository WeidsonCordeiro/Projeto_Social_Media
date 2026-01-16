//Components
import { AuthContext } from "../../context/AuthContext";
import Post from "../post/Post";
import Share from "../share/Share";

//Hooks
import { useState, useEffect, useContext } from "react";

//Css
import styles from "./Feed.module.css";

//Utils
import { requestConfig, getToLocalStorage } from "../../utils/config";

const Feed = ({ username }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const loadPosts = async () => {
    setLoading(true);
    const token = getToLocalStorage("user")?.token;
    const config = requestConfig("GET", null, token);
    try {
      const res = username
        ? await fetch(`/api/posts/profile/${username}`, config)
        : await fetch(`/api/posts/timeline/${user._id}`, config);
      const result = await res.json();

      if (result.errors) {
        setError(result.errors);
        return;
      }
      setPosts(result);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
      setError("Error fetching posts!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [username, user._id]);

  return (
    <div className={styles.feedContainer}>
      <div className={styles.feedWrapper}>
        {(!username || username === user.username) && (
          <Share onPostCreated={loadPosts} />
        )}
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
