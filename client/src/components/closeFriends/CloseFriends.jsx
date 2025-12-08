//Css
import styles from "./CloseFriends.module.css";


const CloseFriends = ( { users } ) => {
  return (
    <li className={styles.sidebarFiend}>
        <img className={styles.sidebarFiendImg} src={users.profilePicture} alt="" />
        <span className={styles.sidebarFiendName}>{users.username}</span>
    </li>
)
}

export default CloseFriends