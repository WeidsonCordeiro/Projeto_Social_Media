//Components
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Dropdown from "../dropdown/Dropdown";
import ConfirmModal from "../confirmModal/ConfirmModal";
import EditPostInfoModal from "../editPostInfoModal/EditPostInfoModal";

//Hooks
import { useState, useEffect } from "react";
import { format } from "timeago.js";
import { Link } from "react-router-dom";

//Css
import styles from "./Post.module.css";

//Icons Material UI
import { Edit, MoreVert, Delete } from "@mui/icons-material";

//Utils
import { requestConfig, getToLocalStorage } from "../../utils/config";

//Icons assets
import noAvatar from "../../assets/person/noAvatar.webp";
import likeSvg from "../../assets/icons/1.like.svg";
import heartWebp from "../../assets/icons/2.coracao.webp";

const Post = ({ post, onPostCreated }) => {
  const [likes, setLikes] = useState(post.likes || []);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showEditPostInfo, setShowEditPostlInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const isOwnProfile = post.userId._id === user._id;

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

  const handleDeletePost = async () => {
    setLoading(true);
    const token = getToLocalStorage("user")?.token;
    const config = requestConfig("DELETE", null, token);
    try {
      const res = await fetch(`/api/posts/${post._id}`, config);
      const result = await res.json();

      if (result.errors) {
        setError(result.errors);
        return;
      }

      if (onPostCreated) {
        onPostCreated();
      }
      setConfirmOpen(false);
    } catch (error) {
      console.error("Erro ao remover post:", error);
      setError("Erro ao remover post!");
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      label: "Editar post",
      icon: <Edit fontSize="small" />,
      onClick: () => {
        setShowEditPostlInfo(true);
      },
    },
    {
      label: "Excluir post",
      icon: <Delete fontSize="small" />,
      danger: true,
      onClick: () => {
        setConfirmOpen(true);
      },
    },
  ];

  return (
    <div className={styles.postContainer}>
      <div className={styles.postWrapper}>
        <div className={styles.postTop}>
          <div className={styles.postTopLeft}>
            <Link to={`/profile/${post.userId.username}`}>
              <img
                className={styles.postProfileImg}
                src={
                  post.userId.profilePicture?.url
                    ? post.userId.profilePicture.url
                    : noAvatar
                }
                alt=""
              />
            </Link>
            <span className={styles.postUserName}>{post.userId.username}</span>
            <span className={styles.postDate}>{format(post.createdAt)}</span>
          </div>
          <div className={styles.postTopRight}>
            {isOwnProfile && (
              <>
                <div style={{ position: "relative" }}>
                  <MoreVert
                    style={{ cursor: "pointer" }}
                    onClick={() => setOpenDropdown(!openDropdown)}
                  />
                  <Dropdown
                    open={openDropdown}
                    onClose={() => setOpenDropdown(false)}
                    items={items}
                  />
                </div>
                <ConfirmModal
                  open={confirmOpen}
                  title="Delete post"
                  description="Are you sure you want to delete this post? This action cannot be undone."
                  confirmText="Delete"
                  cancelText="Cancel"
                  onCancel={() => setConfirmOpen(false)}
                  onConfirm={handleDeletePost}
                />
                {showEditPostInfo && (
                  <EditPostInfoModal
                    imagePost={post.img}
                    description={post.description}
                    onClose={() => setShowEditPostlInfo(false)}
                    onSave={async (data) => {
                      try {
                        setLoading(true);

                        const token = getToLocalStorage("user")?.token;
                        const config = requestConfig(
                          "PUT",
                          {
                            userId: post.userId._id,
                            description: data,
                          },
                          token
                        );
                        const res = await fetch(
                          `/api/posts/${post._id}`,
                          config
                        );
                        const result = await res.json();
                        if (result.errors) {
                          setError(result.errors);
                          setLoading(false);
                          return;
                        }
                        setShowEditPostlInfo(false);
                        onPostCreated();
                      } catch (error) {
                        console.error("Error updating post info:", error);
                        setLoading(false);
                        setError("Error updating post info!");
                      } finally {
                        setLoading(false);
                        setShowEditPostlInfo(false);
                      }
                    }}
                  />
                )}
              </>
            )}
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
