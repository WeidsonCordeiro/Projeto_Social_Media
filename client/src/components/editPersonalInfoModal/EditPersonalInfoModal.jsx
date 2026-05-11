//Hooks
import { useRef, useState } from "react";

//Css
import styles from "./EditPersonalInfoModal.module.css";

export default function EditPersonalInfoModal({ user, onClose, onSave }) {
  const [newUser, setNewUser] = useState({
    username: user.username || "",
    description: user.description || "",
    city: user.city || "",
    from: user.from || "",
    relationship: user.relationship || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const hasChanged =
      user.username !== newUser.username ||
      user.description !== newUser.description ||
      user.city !== newUser.city ||
      user.from !== newUser.from ||
      user.relationship !== newUser.relationship;

    if (!hasChanged) {
      console.log("No changes detected. Modal closed without saving.");
      onClose();
      return;
    }
    onSave(newUser);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h3>You can change your personal information here</h3>
        </header>

        <div className={styles.content}>
          <form
            className={styles.loginRight}
            onSubmit={handleSubmit}
            noValidate
          >
            <label htmlFor="username"></label>
            <input
              className={styles.loginInput}
              type="text"
              name="username"
              placeholder="Name"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
            />
            <label htmlFor="description"></label>
            <input
              className={styles.loginInput}
              type="text"
              name="description"
              placeholder="Description"
              value={newUser.description}
              onChange={(e) =>
                setNewUser({ ...newUser, description: e.target.value })
              }
            />
            <label htmlFor="city"></label>
            <input
              className={styles.loginInput}
              type="text"
              name="city"
              placeholder="City"
              value={newUser.city}
              onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
            />
            <label htmlFor="from"></label>
            <input
              className={styles.loginInput}
              type="text"
              name="from"
              placeholder="From"
              value={newUser.from}
              onChange={(e) => setNewUser({ ...newUser, from: e.target.value })}
            />
            <label htmlFor="relationship"></label>
            <select
              className={styles.loginInput}
              name="relationship"
              id="relationship"
              value={newUser.relationship}
              onChange={(e) =>
                setNewUser({ ...newUser, relationship: e.target.value })
              }
            >
              <option value="">Select Status</option>
              <option value="1">Single</option>
              <option value="2">Married</option>
              <option value="3">Divorcied</option>
            </select>
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
