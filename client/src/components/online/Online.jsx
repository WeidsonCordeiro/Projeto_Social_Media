//Css
import styles from "./Online.module.css";

const Online = ( { users } ) => {
  return (
    <li className={styles.rightbarFriend}>
        <div className={styles.rightbarProfileImgContainer}>
            <img className={styles.rightbarProfileImg} src={users.profilePicture} alt="" />
            <span className={styles.rightbarOnline}></span>
        </div>
        <span className={styles.rightbarUsername}>{users.username}</span>
    </li>
  )
}

export default Online
