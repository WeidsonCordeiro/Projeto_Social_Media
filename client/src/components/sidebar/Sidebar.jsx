//Components
import CloseFriends from "../closeFriends/CloseFriends";

//Hooks
import { useContext } from "react";

// Context
import { AuthContext } from "../../context/AuthContext";
import { updateUser } from "../../context/AuthActions";

//Css
import styles from "./Sidebar.module.css";

//Icons Material UI
import {
  Bookmark,
  Chat,
  Group,
  HelpOutline,
  PlayCircleFilledOutlined,
  RssFeed,
  School,
  WorkOutline,
  Event,
} from "@mui/icons-material";

const Sidebar = ({ user: profileUser }) => {
  const { user: currentUser } = useContext(AuthContext);

  const user = profileUser || currentUser;

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.sidebarWrapper}>
        <ul className={styles.sidebarList}>
          <li className={styles.sidebarListItem}>
            <RssFeed className={styles.sidebarIcon} />
            <span className={styles.sidebarListItemText}>Feed</span>
          </li>
          <li className={styles.sidebarListItem}>
            <Chat className={styles.sidebarIcon} />
            <span className={styles.sidebarListItemText}>Chats</span>
          </li>
          <li className={styles.sidebarListItem}>
            <PlayCircleFilledOutlined className={styles.sidebarIcon} />
            <span className={styles.sidebarListItemText}>Videos</span>
          </li>
          <li className={styles.sidebarListItem}>
            <Group className={styles.sidebarIcon} />
            <span className={styles.sidebarListItemText}>Groups</span>
          </li>
          <li className={styles.sidebarListItem}>
            <Bookmark className={styles.sidebarIcon} />
            <span className={styles.sidebarListItemText}>Bookmarks</span>
          </li>
          <li className={styles.sidebarListItem}>
            <HelpOutline className={styles.sidebarIcon} />
            <span className={styles.sidebarListItemText}>Questions</span>
          </li>
          <li className={styles.sidebarListItem}>
            <WorkOutline className={styles.sidebarIcon} />
            <span className={styles.sidebarListItemText}>Jobs</span>
          </li>
          <li className={styles.sidebarListItem}>
            <Event className={styles.sidebarIcon} />
            <span className={styles.sidebarListItemText}>Events</span>
          </li>
          <li className={styles.sidebarListItem}>
            <School className={styles.sidebarIcon} />
            <span className={styles.sidebarListItemText}>Courses</span>
          </li>
        </ul>
        <button className={styles.sidebarButton}>Show More</button>
        <hr className={styles.sidebarHr} />
        <ul className={styles.sidebarFriendList}>
          {user.followings?.map((friend) => (
            <CloseFriends key={friend._id} users={friend} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
