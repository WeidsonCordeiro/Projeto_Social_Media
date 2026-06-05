//React Hooks
import { useRef, useState } from "react";

//Icons Material UI
import CloseIcon from "@mui/icons-material/Close";

//Assets Icons
import noAvatar from "../../assets/person/noAvatar.webp";

//Css
import styles from "./EditCommentModal.module.css";

export default function EditCommentModal({
  imageComment,
  userComment,
  description,
  onClose,
  onSave,
}) {
  const [descriptionInfo, setDescriptionInfo] = useState(description);
  const [preview, setPreview] = useState(imageComment || noAvatar);

  const hasChanged = description !== descriptionInfo;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!hasChanged) {
      onClose();
      return;
    }
    onSave(descriptionInfo);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h3>You can change your comment information here</h3>

          <button className={styles.closeButton} onClick={onClose}>
            <CloseIcon fontSize="small" />
          </button>
        </header>

        <div className={styles.content}>
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.userInfo}>
              <img src={preview} alt={userComment} className={styles.avatar} />

              <div>
                <h4>{userComment}</h4>
                <span>Editing comment</span>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label>Original comment</label>

              <div className={styles.originalComment}>{description}</div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="description">New comment</label>

              <textarea
                className={styles.commentInput}
                name="description"
                value={descriptionInfo || ""}
                maxLength={500}
                onChange={(e) => setDescriptionInfo(e.target.value)}
              />
            </div>

            <span className={styles.counter}>
              {descriptionInfo?.length || 0}/500
            </span>

            <footer className={styles.footer}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={styles.primaryButton}
                disabled={!hasChanged}
              >
                Save
              </button>
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
}
