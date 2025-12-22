//Components
import { useState, useEffect } from "react";
import Post from "../post/Post";
import Share from "../share/Share";

//Css
import styles from "./Feed.module.css";

//Data dummy
// import { Posts } from '../../dummyData';

const feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "/api/posts/timeline/69412f45aea423d76aafbe71"
        ); // Replace with actual userId
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  console.log("Posts fetched:", posts);

  return (
    <div className={styles.feedContainer}>
      <div className={styles.feedWrapper}>
        <Share />
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
};

export default feed;
