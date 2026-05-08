//Hooks
import { useRef, useState } from "react";

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

  /*  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, []);
*/
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h3>You can change or remove your image here</h3>
        </header>

        <div className={styles.content}>
          {preview ? (
            <div className={styles.imageContainer}>
              <img
                className={styles.profileUserImg}
                src={preview}
                alt="Image cover preview"
              />
            </div>
          ) : (
            <div className={styles.placeholder}>No cover image</div>
          )}

          <div className={styles.actions}>
            <button
              className={styles.EditProfileModalCancelButton}
              onClick={handleRemove}
              disabled={!preview}
            >
              Remove photo
            </button>

            <button
              className={styles.EditProfileModalSaveButton}
              onClick={() => fileInputRef.current.click()}
            >
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
          <button
            className={styles.EditProfileModalCancelButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={styles.EditProfileModalSaveButton}
            onClick={handleSave}
          >
            Save
          </button>
        </footer>
      </div>
    </div>
  );
}
