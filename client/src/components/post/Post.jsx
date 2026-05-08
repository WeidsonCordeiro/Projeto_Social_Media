//Components
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

//Hooks
import { useState, useEffect } from "react";
import { format } from "timeago.js";
import { Link } from "react-router-dom";

//Css
import styles from "./Post.module.css";

//Icons
import { MoreVert } from "@mui/icons-material";

//Utils
import { requestConfig, getToLocalStorage } from "../../utils/config";

//Icons assets
import noAvatar from "../../assets/person/noAvatar.webp";
import likeSvg from "../../assets/icons/1.like.svg";
import heartWebp from "../../assets/icons/2.coracao.webp";

const Post = ({ post }) => {
  const [likes, setLikes] = useState(post.likes || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const likeHandler = async () => {
    if (!user?._id) {
      setError("Faça login para dar like");
      return;
    }

    setLoading(true);
    const token = getToLocalStorage("user")?.token;
    const config = requestConfig("PUT", { userId: user._id }, token);
    try {
      const res = await fetch(`/api/posts/likes/${post._id}`, config);
      const result = await res.json();

      if (result.errors) {
        setError(result.errors);
        return;
      }

      if (result.updatedPost.likes) {
        setLikes(result.updatedPost.likes);
      }
    } catch (error) {
      console.error("Error ao dar like:", error);
      setError("Erro ao dar like!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.postContainer}>
      <div className={styles.postWrapper}>
        <div className={styles.postTop}>
          <div className={styles.postTopLeft}>
            <Link to={`/profile/${user.username}`}>
              <img
                className={styles.postProfileImg}
                src={
                  user.profilePicture?.url ? user.profilePicture.url : noAvatar
                }
                alt=""
              />
            </Link>
            <span className={styles.postUserName}>{user.username}</span>
            <span className={styles.postDate}>{format(post.createdAt)}</span>
          </div>
          <div className={styles.postTopRight}>
            <MoreVert />
          </div>
        </div>
        <div className={styles.postCenter}>
          <span className={styles.postText}>{post.description} </span>
          <img className={styles.postImg} src={post.img} alt="" />
        </div>
        <div className={styles.postBottom}>
          <div className={styles.postBottomLeft}>
            {/* Colocar loading nos botões de like */}
            <img
              className={`${styles.likeIcon} ${styles.likeIconSmall}`}
              onClick={likeHandler}
              src={likeSvg}
              alt="like icon"
            />
            <img
              className={styles.likeIcon}
              onClick={likeHandler}
              src={heartWebp}
              alt="heart icon"
            />
            <span
              className={styles.postLikeCounter}
            >{`${likes.length} people like it`}</span>
          </div>
          <div className={styles.postBottomRight}>
            <span
              className={styles.postCommentText}
            >{`${post.comments.length} comment(s)`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
