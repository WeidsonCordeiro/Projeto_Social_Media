//Hooks
import { Link } from "react-router-dom";

//Css
import styles from "./CloseFriends.module.css";

//Icons assets
import noAvatar from "../../assets/person/noAvatar.webp";

const CloseFriends = ({ users }) => {
  return (
    <Link
      to={`/profile/${users.username}`}
      key={users._id}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <li className={styles.sidebarFiend}>
        <img
          className={styles.sidebarFiendImg}
          src={users.profilePicture?.url ? users.profilePicture.url : noAvatar}
          alt=""
        />
        <span className={styles.sidebarFiendName}>{users.username}</span>
      </li>
    </Link>
  );
};

export default CloseFriends;
