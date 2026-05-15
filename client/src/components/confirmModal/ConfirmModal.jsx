//Css
import styles from "./confirmModal.module.css";

export default function ConfirmModal({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  cancelText = "Cancel",
  confirmText = "Confirm",
}) {
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
        </div>

        <p className={styles.description}>{description}</p>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            {cancelText}
          </button>

          <button className={styles.confirmBtn} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
