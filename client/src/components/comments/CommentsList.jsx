//React Hooks
import { useState } from "react";

//Components
import CommentItem from "./CommentItem";
import ConfirmModal from "../../components/confirmModal/ConfirmModal";
import EditCommentModal from "../editCommentModal/EditCommentModal";

//Utils
import { getToLocalStorage } from "../../utils/config";

//Services
import { updateComment, deleteComment } from "../../services/postService";

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

    try {
      const result = await deleteComment(post._id, selectedComment._id, token);

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

    try {
      const result = await updateComment(
        post._id,
        selectedComment._id,
        description,
        token
      );

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
