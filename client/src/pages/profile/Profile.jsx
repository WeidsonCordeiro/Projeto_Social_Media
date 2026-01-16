//Components
import Topbar from "../../components/Topbar/Topbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Feed from "../../components/Feed/Feed";
import Rightbar from "../../components/Rightbar/Rightbar";

//Hooks
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

//Css
import styles from "./Profile.module.css";

//Profile Page
import ProfileImage from "../../assets/person/2.webp";
import CoverImage from "../../assets/img/cover.webp";
import noPicture from "../../assets/person/noPicture.webp";

//Utils
import { requestConfig, getToLocalStorage } from "../../utils/config";

const Profile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { username } = useParams();

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      const token = getToLocalStorage("user")?.token;
      const config = requestConfig("GET", null, token);
      try {
        const res = await fetch(
          `/api/users/username/${encodeURIComponent(username)}`,
          config
        );
        debugger;
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
  }, [username]);

  return (
    <>
      <Topbar />
      <div className={styles.profileContainer}>
        <Sidebar />
        <div className={styles.profileRight}>
          <div className={styles.profileRightTop}>
            <div className={styles.profileCover}>
              <img
                className={styles.profileCoverImg}
                src={user.coverPicture}
                alt=""
              />
              <Link to={`/profile/${user.username}`}>
                <img
                  className={styles.profileUserImg}
                  src={user.profilePicture ? user.profilePicture : noPicture}
                  alt=""
                />
              </Link>
            </div>
            <div className={styles.profileInfo}>
              <h4 className={styles.profileInfoName}>{user.username}</h4>
              <span className={styles.profileInfoDesc}>{user.desc}</span>
              {/* <div className={styles.profileInfoDetails}>
                <div className={styles.profileInfoItem}>
                  <PermIdentity className={styles.profileInfoIcon} />
                  <span className={styles.profileInfoText}>johndoe99</span>
                </div>
              </div> */}
            </div>
          </div>
          <div className={styles.profileRightBottom}>
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
