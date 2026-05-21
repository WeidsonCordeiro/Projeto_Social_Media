//Hooks
import { useState } from "react";

//Icons Material UI
import CloseIcon from "@mui/icons-material/Close";

//Icons assets
import noCover from "../../assets/person/noCover.webp";

//Css
import styles from "./EditPostInfoModal.module.css";

export default function EditPostInfoModal({
  imagePost,
  description,
  onClose,
  onSave,
}) {
  const [descriptionInfo, setDescriptionInfo] = useState(description);
  const [preview, setPreview] = useState(imagePost || noCover);

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
          <h3>You can change your post information here</h3>

          <button className={styles.closeButton} onClick={onClose}>
            <CloseIcon fontSize="small" />
          </button>
        </header>

        <div className={styles.content}>
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.imageContainer}>
              <img src={preview} alt="Image post preview" />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="description">Edit your post description</label>

              <input
                className={styles.loginInput}
                type="text"
                name="description"
                value={descriptionInfo ? descriptionInfo : ""}
                onChange={(e) => setDescriptionInfo(e.target.value)}
              />
            </div>

            <footer className={styles.footer}>
              <button
                type="button"
                className={styles.EditPersonalInfoModalCancelButton}
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={styles.EditPersonalInfoModalSaveButton}
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
