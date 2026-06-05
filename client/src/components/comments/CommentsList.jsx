//React Hooks
import { useState, useEffect } from "react";

//Components
import CommentItem from "./CommentItem";
import ConfirmModal from "../../components/confirmModal/ConfirmModal";
import EditCommentModal from "../editCommentModal/EditCommentModal";

//Utils
import { requestConfig, getToLocalStorage } from "../../../utils/config";

//Css
import styles from "./CommentsList.module.css";

const CommentsList = ({ comments, currentUser, post, setComments }) => {
  const [selectedComment, setSelectedComment] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteComment = async () => {
    setLoading(true);
    const token = getToLocalStorage("user")?.token;
    const config = requestConfig("DELETE", null, token);

    try {
      const res = await fetch(
        `/api/posts/${post._id}/comments/${selectedComment._id}`,
        config
      );
      const result = await res.json();

      if (!result.errors) {
        setConfirmDelete(false);

        if (result.updatedPost?.comments) {
          setComments(result.updatedPost.comments);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateComment = async (description) => {
    setLoading(true);
    const token = getToLocalStorage("user")?.token;
    const config = requestConfig("PUT", { text: description }, token);

    try {
      const res = await fetch(
        `/api/posts/${post._id}/comments/${selectedComment._id}`,
        config
      );
      const result = await res.json();

      if (!result.errors) {
        setShowEditModal(false);

        if (result.updatedPost?.comments) {
          setComments(result.updatedPost.comments);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.commentsSection}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUser={currentUser}
              post={post}
              onEdit={() => {
                setSelectedComment(comment);
                setShowEditModal(true);
              }}
              onDelete={() => {
                setSelectedComment(comment);
                setConfirmDelete(true);
              }}
            />
          ))
        ) : (
          <div className={styles.emptyComments}>No comments yet</div>
        )}
      </div>

      <ConfirmModal
        open={confirmDelete}
        title="Delete comment"
        description="Are you sure?"
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={handleDeleteComment}
      />
      {showEditModal && (
        <EditCommentModal
          imageComment={selectedComment.userId.profilePicture.url}
          userComment={selectedComment.userId.username}
          description={selectedComment.text}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateComment}
          // onSave={(description) => handleUpdatePost(description)}
        />
      )}
    </>
  );
};

export default CommentsList;
