//React Hooks
import { useState, useContext, useEffect } from "react";

//Context
import { AuthContext } from "../../context/AuthContext";

//Components
import PostHeader from "./PostHeader";
import PostBody from "./PostBody";
import PostActions from "./PostActions";
import CommentsList from "../comments/CommentsList";
import CommentForm from "../comments/CommentForm";
import ConfirmModal from "../confirmModal/ConfirmModal";
import EditPostInfoModal from "../editPostInfoModal/EditPostInfoModal";

//Utils
import { requestConfig, getToLocalStorage } from "../../utils/config";

//Css
import styles from "./Post.module.css";

const Post = ({ post, refreshPosts }) => {
  const { user } = useContext(AuthContext);

  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLikes(post.likes || []);
  }, [post.likes]);

  useEffect(() => {
    setComments(post.comments || []);
  }, [post.comments]);

  const likeHandler = async () => {
    const token = getToLocalStorage("user")?.token;
    const config = requestConfig("PUT", { userId: user._id }, token);

    try {
      const res = await fetch(`/api/posts/likes/${post._id}`, config);

      const result = await res.json();

      if (result.updatedPost?.likes) {
        setLikes(result.updatedPost.likes);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePost = async (description) => {
    try {
      setLoading(true);
      setShowEditModal(false);
      const token = getToLocalStorage("user")?.token;
      const config = requestConfig(
        "PUT",
        {
          userId: post.userId._id,
          description,
        },
        token
      );
      const res = await fetch(`/api/posts/${post._id}`, config);
      const result = await res.json();
      if (result.errors) {
        setLoading(false);
        return;
      }
      refreshPosts();
    } catch (error) {
      console.error("Error updating post info:", error);
      setLoading(false);
    } finally {
      setLoading(false);
      setShowEditModal(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      setLoading(true);
      setConfirmDelete(false);

      const token = getToLocalStorage("user")?.token;
      const config = requestConfig("DELETE", null, token);

      const res = await fetch(`/api/posts/${post._id}`, config);

      const result = await res.json();

      if (result.errors) {
        setLoading(false);
        return;
      }

      refreshPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      setLoading(false);
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className={styles.postContainer}>
      <div className={styles.postWrapper}>
        <PostHeader
          post={post}
          currentUser={user}
          onEditPost={() => setShowEditModal(true)}
          onDeletePost={() => setConfirmDelete(true)}
        />

        <ConfirmModal
          open={confirmDelete}
          title="Delete post"
          description="Are you sure you want to delete this post? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onCancel={() => setConfirmDelete(false)}
          onConfirm={handleDeletePost}
        />

        {showEditModal && (
          <EditPostInfoModal
            imagePost={post.img}
            description={post.description}
            onClose={() => setShowEditModal(false)}
            onSave={handleUpdatePost}
            // onSave={(description) => handleUpdatePost(description)}
          />
        )}

        <PostBody post={post} />

        <PostActions
          likes={likes}
          commentsCount={comments.length}
          onLike={likeHandler}
          onToggleComments={() => setShowComments(!showComments)}
        />

        {showComments && (
          <>
            <CommentsList
              comments={comments}
              currentUser={user}
              post={post}
              setComments={setComments}
            />

            <CommentForm
              post={post}
              currentUser={user}
              setComments={setComments}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Post;
