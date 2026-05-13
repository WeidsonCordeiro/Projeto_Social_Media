//Hooks
import { useEffect, useRef } from "react";

//Css
import styles from "./Dropdown.module.css";

export default function Dropdown({
  open,
  onClose,
  items = [],
  position = "right",
}) {
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      ref={dropdownRef}
      className={`${styles.dropdown} ${
        position === "left" ? styles.left : styles.right
      }`}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={`${styles.item} ${item.danger ? styles.danger : ""}`}
          onClick={() => {
            item.onClick();
            onClose();
          }}
        >
          {item.icon && <span className={styles.icon}>{item.icon}</span>}

          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
