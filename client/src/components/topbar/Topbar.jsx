//Hooks
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { logout } from "../../context/AuthActions";

//Components
import Dropdown from "../dropdown/Dropdown";

//Css
import styles from "./Topbar.module.css";

//Icons assets
import noAvatar from "../../assets/person/noAvatar.webp";

//Icons Material UI
import {
  Person,
  Chat,
  Notifications,
  Search,
  Logout,
} from "@mui/icons-material";

const Topbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [openDropdown, setOpenDropdown] = useState(false);
  const navigate = useNavigate();

  const items = [
    {
      label: "Profile",
      icon: <Person fontSize="small" />,
      onClick: () => {
        navigate(`/profile/${user.username}`);
      },
    },
    {
      label: "Sair",
      icon: <Logout fontSize="small" />,
      danger: true,
      onClick: () => {
        dispatch(logout());
      },
    },
  ];

  return (
    <div className={styles.topbarContainer}>
      <div className={styles.topbarLeft}>
        <Link to="/" className={styles.linkStyle}>
          <span className={styles.logo}>SocialMedia</span>
        </Link>
      </div>
      <div className={styles.topbarCenter}>
        <div className={styles.searchBar} title="not implemented yet">
          <Search className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search for friend, post or video"
          />
        </div>
      </div>
      <div className={styles.topbarRight}>
        <div className={styles.topbarIcons}>
          <div className={styles.topbarIconItem} title="not implemented yet">
            <Person />
            <span className={styles.topbarIconBadge}>1</span>
          </div>
          <div className={styles.topbarIconItem} title="not implemented yet">
            <Chat />
            <span className={styles.topbarIconBadge}>2</span>
          </div>
          <div className={styles.topbarIconItem} title="not implemented yet">
            <Notifications />
            <span className={styles.topbarIconBadge}>1</span>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <img
            className={styles.topbarImg}
            src={user.profilePicture?.url ? user.profilePicture.url : noAvatar}
            alt=""
            onClick={() => setOpenDropdown(!openDropdown)}
          />
          <Dropdown
            open={openDropdown}
            onClose={() => setOpenDropdown(false)}
            items={items}
          />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
