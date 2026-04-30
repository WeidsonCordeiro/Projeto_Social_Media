//Hooks
import { useRef, useState } from "react";

//Css
import styles from "./EditCoverModal.module.css";

export default function EditCoverModal({ imageCover, onClose, onSave }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(imageCover);
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
      img: removed ? null : file,
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
            <img src={preview} alt="Image cover preview" />
          ) : (
            <div className={styles.placeholder}>No cover image</div>
          )}

          <div className={styles.actions}>
            <button
              className={styles.EditCoverModalCalcelButton}
              onClick={handleRemove}
              disabled={!preview}
            >
              Remove photo
            </button>

            <button
              className={styles.EditCoverModalSaveButton}
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
            className={styles.EditCoverModalCalcelButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={styles.EditCoverModalSaveButton}
            onClick={handleSave}
          >
            Save
          </button>
        </footer>
      </div>
    </div>
  );
}
