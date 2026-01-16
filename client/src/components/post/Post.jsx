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
import { postImageUrl, userImageUrl } from "../../utils/imageUrl";

// Icons assets
import likeSvg from "../../assets/icons/1.like.svg";
import heartWebp from "../../assets/icons/2.coracao.webp";
import noPicture from "../../assets/person/noPicture.webp";

const Post = ({ post }) => {
  const [likes, setLikes] = useState(post.likes || []);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user: currentUser } = useContext(AuthContext);

  const likeHandler = async () => {
    if (!currentUser?._id) {
      setError("Faça login para dar like");
      return;
    }

    setLoading(true);
    const token = getToLocalStorage("user")?.token;
    const config = requestConfig("PUT", { userId: currentUser._id }, token);
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

  useEffect(() => {
    setLoading(true);

    if (!post.userId) {
      setUser({});
      return;
    }

    const fetchUser = async () => {
      try {
        const token = getToLocalStorage("user")?.token;
        const config = requestConfig("GET", null, token);

        const res = await fetch(`/api/users/${post.userId}`, config);
        const result = await res.json();

        if (result.errors) {
          setError(result.errors);
          return;
        }

        setUser(result);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser({});
        setError("Error fetching user!");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    return () => {
      setLoading(false);
    };
  }, [post.userId]);

  return (
    <div className={styles.postContainer}>
      <div className={styles.postWrapper}>
        <div className={styles.postTop}>
          <div className={styles.postTopLeft}>
            <Link to={`/profile/${user.username}`}>
              <img
                className={styles.postProfileImg}
                src={
                  user.profilePicture
                    ? userImageUrl(user.profilePicture)
                    : noPicture
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
          <img
            className={styles.postImg}
            src={post.img ? postImageUrl(post.img) : null}
            alt=""
          />
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
            >{`${post.comment} comment(s)`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
