//React Hooks
import { useState } from "react";
import { Link } from "react-router-dom";

//Components
import Dropdown from "../dropdown/Dropdown";

//Formatter Date
import { format } from "timeago.js";

//Material UI Icons
import { MoreVert, Edit, Delete } from "@mui/icons-material";

//Assets icons
import noAvatar from "../../assets/person/noAvatar.webp";

//Css
import styles from "./PostHeader.module.css";

const PostHeader = ({ post, currentUser, onEditPost, onDeletePost }) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const isOwnProfile = post.userId._id === currentUser._id;

  const items = [
    {
      label: "Edit post",
      icon: <Edit fontSize="small" />,
      onClick: onEditPost,
    },
    {
      label: "Delete post",
      icon: <Delete fontSize="small" />,
      danger: true,
      onClick: onDeletePost,
    },
  ];

  return (
    <div className={styles.postTop}>
      <div className={styles.postTopLeft}>
        <Link to={`/profile/${post.userId.username}`}>
          <img
            className={styles.postProfileImg}
            src={post.userId.profilePicture?.url || noAvatar}
            alt=""
          />
        </Link>
        <span className={styles.postUserName}>{post.userId.username}</span>
        <span className={styles.postDate}>{format(post.createdAt)}</span>
      </div>

      {isOwnProfile && (
        <div style={{ position: "relative" }}>
          <MoreVert
            style={{ cursor: "pointer" }}
            onClick={() => setOpenDropdown(!openDropdown)}
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

export default PostHeader;
