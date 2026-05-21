//Components
import { AuthContext } from "../../context/AuthContext";
import Post from "../post/Post";
import Share from "../share/Share";

//Hooks
import { useState, useEffect, useContext } from "react";

//Material UI
import { CircularProgress } from "@mui/material";

//Css
import styles from "./Feed.module.css";

//Utils
import { requestConfig, getToLocalStorage } from "../../utils/config";

const Feed = ({ username, refreshFeed }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const loadPosts = async () => {
    setLoading(true);
    const token = getToLocalStorage("user")?.token;
    const config = requestConfig("GET", null, token);
    try {
      // console.log(
      //   username
      //     ? `Fetching posts for profile: ${username}`
      //     : `Fetching timeline posts for user ID: ${user._id}`,
      // );
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
  }, [username, user._id, refreshFeed]);

  return (
    <div className={styles.feedContainer}>
      {loading && (
        <div className="loading">
          <CircularProgress color="black" size={40} />
        </div>
      )}
      <div className={styles.feedWrapper}>
        {(!username || username === user.username) && (
          <Share onPostCreated={loadPosts} />
        )}
        {!loading && posts.length === 0 && (
          <div className={styles.emptyFeed}>
            <h3>
              <span className={styles.username}>{username}</span> hasn't posted
              yet
            </h3>
            <span>When new posts are shared, they will appear here.</span>
          </div>
        )}
        {!loading &&
          posts.length > 0 &&
          posts.map((p) => (
            <Post key={p._id} post={p} onPostCreated={loadPosts} />
          ))}
      </div>
    </div>
  );
};

export default Feed;
