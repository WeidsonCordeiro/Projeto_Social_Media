//React Hooks
import { useState } from "react";
import { Link } from "react-router-dom";

//Components
import Dropdown from "../../components/dropdown/Dropdown";

//Material UI
import { MoreVert, Edit, Delete } from "@mui/icons-material";

//Icons assets
import noAvatar from "../../assets/person/noAvatar.webp";

//Css
import styles from "./CommentItem.module.css";

const CommentItem = ({ comment, currentUser, post, onEdit, onDelete }) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  const canEdit = post.userId._id === currentUser._id;
  const canDelete =
    comment.userId._id === currentUser._id ||
    post.userId._id === currentUser._id;

  const items = [
    ...(canEdit
      ? [
          {
            label: "Edit comment",
            icon: <Edit fontSize="small" />,
            onClick: onEdit,
          },
        ]
      : []),
    ...(canDelete
      ? [
          {
            label: "Delete comment",
            icon: <Delete fontSize="small" />,
            danger: true,
            onClick: onDelete,
          },
        ]
      : []),
  ];

  return (
    <div className={styles.commentItem}>
      <Link to={`/profile/${comment.userId.username}`}>
        <img
          className={styles.commentProfileImg}
          src={comment.userId.profilePicture?.url || noAvatar}
          alt=""
        />
      </Link>

      <div className={styles.commentsList}>
        <strong className={styles.commentUserName}>
          {comment.userId.username}
        </strong>
        <p>{comment.text}</p>
      </div>

      {(canEdit || canDelete) && (
        <div style={{ position: "relative", marginLeft: "auto" }}>
          <MoreVert
            style={{ cursor: "pointer" }}
            onClick={() => {
              setOpenDropdown(!openDropdown);
            }}
          />

          <Dropdown
            open={openDropdown}
            onClose={() => setOpenDropdown(false)}
            items={items}
          />
        </div>
      )}
    </div>
  );
};

export default CommentItem;
