//Hooks
import { Link } from "react-router-dom";

//Icons assets
import noAvatar from "../../assets/person/noAvatar.webp";

//Css
import styles from "./Online.module.css";

const Online = ({ users }) => {
  return (
    <Link
      to={`/profile/${users.username}`}
      key={users._id}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <li className={styles.rightbarFriend}>
        <div className={styles.rightbarProfileImgContainer}>
          <img
            className={styles.rightbarProfileImg}
            src={
              users.profilePicture?.url ? users.profilePicture.url : noAvatar
            }
            alt=""
          />
          <span className={styles.rightbarOnline}></span>
        </div>
        <span className={styles.rightbarUsername}>{users.username}</span>
      </li>
    </Link>
  );
};

export default Online;
