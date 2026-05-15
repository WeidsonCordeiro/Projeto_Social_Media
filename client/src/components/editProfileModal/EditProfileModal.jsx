import { useRef, useState } from "react";

//Icons Material UI
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";

//Css
import styles from "./EditProfileModal.module.css";

export default function EditProfileModal({ imagePicture, onClose, onSave }) {
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(imagePicture);
  const [removed, setRemoved] = useState(false);
  const [file, setFile] = useState(null);
  const [hasChanged, setHasChanged] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    const newPreview = URL.createObjectURL(selectedFile);

    setFile(selectedFile);
    setPreview(newPreview);
    setRemoved(false);
    setHasChanged(true);
  };

  const handleRemove = () => {
    setPreview(null);
    setFile(null);
    setRemoved(true);
    setHasChanged(true);
  };

  const handleSave = () => {
    if (!hasChanged) {
      onClose();
      return;
    }

    onSave({
      profilePicture: removed ? null : file,
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h3>You can change or remove your image here</h3>

          <button className={styles.closeButton} onClick={onClose}>
            <CloseIcon fontSize="small" />
          </button>
        </header>

        <div className={styles.content}>
          {preview ? (
            <div className={styles.imageContainer}>
              <img
                className={styles.profileUserImg}
                src={preview}
                alt="Profile preview"
              />
            </div>
          ) : (
            <div className={styles.placeholder}>No profile image</div>
          )}

          <div className={styles.actions}>
            <button
              className={styles.dangerButton}
              onClick={handleRemove}
              disabled={!preview}
            >
              <DeleteOutlineIcon fontSize="small" />
              Remove photo
            </button>

            <button
              className={styles.primaryButton}
              onClick={() => fileInputRef.current.click()}
            >
              <AddPhotoAlternateOutlinedIcon fontSize="small" />
              Change photo
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              hidden
              onChange={handleFileChange}
            />
          </div>
        </div>

        <footer className={styles.footer}>
          <button className={styles.secondaryButton} onClick={onClose}>
            Cancel
          </button>

          <button
            className={styles.primaryButton}
            onClick={handleSave}
            disabled={!hasChanged}
          >
            Save
          </button>
        </footer>
      </div>
    </div>
  );
}
