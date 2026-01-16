//Hooks
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

//Utils
import { requestConfig, getToLocalStorage } from "../../utils/config";

//Css
import styles from "./Topbar.module.css";

//Icons
import { Person, Chat, Notifications, Search } from "@mui/icons-material";

//Images
import ProfilePic from "../../assets/person/1.webp";
import noPicture from "../../assets/person/noPicture.webp";

const Topbar = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      const token = getToLocalStorage("user")?.token;
      const config = requestConfig("GET", null, token);
      try {
        const res = await fetch(
          `/api/users/username/${encodeURIComponent(currentUser.username)}`,
          config
        );
        const result = await res.json();

        if (result.errors) {
          setError(result.errors);
          setLoading(false);
          return;
        }

        setUser(result);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
        setError("Error fetching users!");
        setUser({});
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    return () => {
      setLoading(false);
    };
  }, [currentUser.username]);

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
        <Link to={`/profile/${user.username}`} className={styles.linkStyle}>
          <img
            src={user.profilePicture || noPicture}
            alt=""
            className={styles.topbarImg}
          />
        </Link>
      </div>
    </div>
  );
};

export default Topbar;
