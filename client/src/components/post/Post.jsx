//React Hooks
import { useState, useContext, useEffect } from "react";

//Context
import { SocketContext } from "../../context/SocketContext";
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
import { getToLocalStorage } from "../../utils/config";

//Services
import { likePost, updatePost, deletePost } from "../../services/postService";

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
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;

    const handleCommentAdded = ({ postId, updatedPost }) => {
      if (postId === post._id) {
        setComments(updatedPost.comments);
      }
    };

    socket.on("commentAdded", handleCommentAdded);

    const handlePostLiked = ({ postId, updatedPost }) => {
      if (postId === post._id) {
        setLikes(updatedPost.likes || []);
      }
    };

    socket.on("postLiked", handlePostLiked);

    const handleCommentDeleted = ({ postId, updatedPost }) => {
      if (postId === post._id) {
        setComments(updatedPost.comments);
      }
    };

    socket.on("commentDeleted", handleCommentDeleted);

    const handleCommentUpdated = ({ postId, updatedPost }) => {
      if (postId === post._id) {
        setComments(updatedPost.comments);
      }
    };

    socket.on("commentUpdated", handleCommentUpdated);

    return () => {
      socket.off("commentAdded", handleCommentAdded);
      socket.off("postLiked", handlePostLiked);
      socket.off("commentDeleted", handleCommentDeleted);
      socket.off("commentUpdated", handleCommentUpdated);
    };
  }, [socket, post._id]);

  useEffect(() => {
    setLikes(post.likes || []);
  }, [post.likes]);

  useEffect(() => {
    setComments(post.comments || []);
  }, [post.comments]);

  const likeHandler = async () => {
    const token = getToLocalStorage("user")?.token;

    try {
      const result = await likePost(post._id, user._id, token);

      if (result.updatedPost?.likes) {
        setLikes(result.updatedPost.likes);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePost = async (description) => {
    const token = getToLocalStorage("user")?.token;

    try {
      setLoading(true);
      setShowEditModal(false);

      const result = await updatePost(
        post._id,
        post.userId._id,
        description,
        token
      );

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
    const token = getToLocalStorage("user")?.token;

    try {
      setLoading(true);
      setConfirmDelete(false);

      const result = await deletePost(post._id, token);

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
