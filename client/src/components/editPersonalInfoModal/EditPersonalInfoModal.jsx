//Hooks
import { useState } from "react";

//Icons Material UI
import CloseIcon from "@mui/icons-material/Close";

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

  const hasChanged =
    user.username !== newUser.username ||
    user.description !== newUser.description ||
    user.city !== newUser.city ||
    user.from !== newUser.from ||
    user.relationship !== newUser.relationship;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!hasChanged) {
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

          <button className={styles.closeButton} onClick={onClose}>
            <CloseIcon fontSize="small" />
          </button>
        </header>

        <div className={styles.content}>
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.fieldGroup}>
              <label htmlFor="username">Username</label>

              <input
                className={styles.loginInput}
                type="text"
                name="username"
                placeholder="Enter your username"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    username: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="description">Description</label>

              <textarea
                className={styles.textArea}
                name="description"
                placeholder="Write something about yourself..."
                value={newUser.description}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    description: e.target.value,
                  })
                }
              />
              <span className={styles.counter}>
                {newUser.description?.length || 0}/500
              </span>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="city">City</label>

              <input
                className={styles.loginInput}
                type="text"
                name="city"
                placeholder="Enter your city"
                value={newUser.city}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    city: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="from">From</label>

              <input
                className={styles.loginInput}
                type="text"
                name="from"
                placeholder="Where are you from?"
                value={newUser.from}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    from: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="relationship">Relationship status</label>

              <select
                className={styles.loginInput}
                name="relationship"
                id="relationship"
                value={newUser.relationship}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    relationship: e.target.value,
                  })
                }
              >
                <option value="">Select status</option>

                <option value="1">Single</option>

                <option value="2">Married</option>

                <option value="3">Divorced</option>
              </select>
            </div>
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
