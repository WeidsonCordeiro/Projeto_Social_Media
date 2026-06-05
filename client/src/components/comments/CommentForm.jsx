import { useState } from "react";

//Utils
import { requestConfig, getToLocalStorage } from "../../../utils/config";

//Icons assets
import noAvatar from "../../assets/person/noAvatar.webp";

//Css
import styles from "./CommentForm.module.css";

const CommentForm = ({ post, currentUser, setComments }) => {
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    setLoading(true);
    const token = getToLocalStorage("user")?.token;
    const config = requestConfig(
      "PUT",
      {
        userId: currentUser._id,
        comments: commentText,
      },
      token
    );

    try {
      const res = await fetch(`/api/posts/comment/${post._id}`, config);
      const result = await res.json();

      if (result.updatedPost?.comments) {
        setComments(result.updatedPost.comments);
      }

      setCommentText("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.commentInputContainer} onSubmit={handleSubmit}>
      <img
        className={styles.commentProfileImg}
        src={
          currentUser.profilePicture?.url
            ? currentUser.profilePicture.url
            : noAvatar
        }
        alt=""
      />
      <input
        className={styles.commentInput}
        type="text"
        placeholder="Write a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />

      <button className={styles.commentButton} disabled={!commentText.trim()}>
        Post
      </button>
    </form>
  );
};

export default CommentForm;
