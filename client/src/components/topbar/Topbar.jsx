//Components
import { Link } from "react-router-dom";

//Css
import styles from "./Topbar.module.css";

//Icons
import { Person, Chat, Notifications, Search } from "@mui/icons-material";

//Images
import ProfilePic from "../../assets/person/1.webp";

const Topbar = () => {
  return (
    <div className={styles.topbarContainer}>
      <div className={styles.topbarLeft}>
        <Link to="/" className={styles.linkStyle}>
          <span className={styles.logo}>SocialMedia</span>
        </Link>
      </div>
      <div className={styles.topbarCenter}>
        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search for friend, post or video"
          />
        </div>
      </div>
      <div className={styles.topbarRight}>
        <div className={styles.topbarLinks}>
          <span className={styles.topbarLink}>Homepage</span>
          <span className={styles.topbarLink}>Timeline</span>
        </div>
        <div className={styles.topbarIcons}>
          <div className={styles.topbarIconItem}>
            <Person />
            <span className={styles.topbarIconBadge}>1</span>
          </div>
          <div className={styles.topbarIconItem}>
            <Chat />
            <span className={styles.topbarIconBadge}>2</span>
          </div>
          <div className={styles.topbarIconItem}>
            <Notifications />
            <span className={styles.topbarIconBadge}>1</span>
          </div>
        </div>
        <img src={ProfilePic} alt="" className={styles.topbarImg} />
      </div>
    </div>
  );
};

export default Topbar;
