//Hooks
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

//Utils
import { requestConfig, getToLocalStorage } from "../../utils/config";

//Css
import styles from "./Topbar.module.css";

//Icons assets
import noAvatar from "../../assets/person/noAvatar.webp";

//Icons
import { Person, Chat, Notifications, Search } from "@mui/icons-material";

const Topbar = () => {
  const { user } = useContext(AuthContext);

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
          <Link to="/" className={styles.linkStyle}>
            <span className={styles.topbarLink}>Homepage</span>
          </Link>
          <Link to={`/profile/${user.username}`} className={styles.linkStyle}>
            <span className={styles.topbarLink}>Timeline</span>
          </Link>
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
        <Link to={`/profile/${user.username}`} className={styles.linkStyle}>
          <img
            className={styles.topbarImg}
            src={user.profilePicture?.url ? user.profilePicture.url : noAvatar}
            alt=""
          />
        </Link>
      </div>
    </div>
  );
};

export default Topbar;
