//Components
import Topbar from "../../components/Topbar/Topbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Feed from "../../components/Feed/Feed";
import Rightbar from "../../components/Rightbar/Rightbar";
import EditCoverModal from "../../components/editCoverModal/EditCoverModal";
import EditProfileModal from "../../components/editProfileModal/EditProfileModal";

// Hooks
import { useContext, useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

// Context
import { AuthContext } from "../../context/AuthContext";
import { updateUser } from "../../context/AuthActions";

//Css
import styles from "./Profile.module.css";

//Material UI
import EditIcon from "@mui/icons-material/Edit";
import { CircularProgress } from "@mui/material";

//Icons assets
import noAvatar from "../../assets/person/noAvatar.webp";
import noCover from "../../assets/person/noCover.webp";

//Utils
import { requestConfig, getToLocalStorage } from "../../utils/config";

const Profile = () => {
  const { username } = useParams();
  const { user: userCredentials, dispatch } = useContext(AuthContext);

  const [remoteUser, setRemoteUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshFeed, setRefreshFeed] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditCover, setShowEditCover] = useState(false);

  const isOwnProfile = userCredentials?.username === username;

  const profileUser = useMemo(() => {
    return isOwnProfile ? userCredentials : remoteUser;
  }, [isOwnProfile, userCredentials, remoteUser]);

  useEffect(() => {
    if (isOwnProfile) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const token = getToLocalStorage("user")?.token;
        const config = requestConfig("GET", null, token);

        const res = await fetch(
          `/api/users/username/${encodeURIComponent(username)}`,
          config,
        );
        const result = await res.json();

        if (result.errors) {
          setError(result.errors);
          setRemoteUser(null);
          return;
        }

        setRemoteUser(result);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Error fetching user");
        setRemoteUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username, isOwnProfile]);

  if (!profileUser) return null;

  return (
    <>
      <Topbar />

      <div className={styles.profileContainer}>
        <Sidebar />

        <div className={styles.profileRight}>
          {loading && (
            <div className="loading">
              <CircularProgress color="black" size={40} />
            </div>
          )}
          <div className={styles.profileRightTop}>
            <div className={styles.profileCover}>
              <img
                className={styles.profileCoverImg}
                src={profileUser.coverPicture?.url || noCover}
                alt="Cover"
              />

              {isOwnProfile && (
                <span
                  title="Edit Cover Picture"
                  className={styles.editIcon}
                  onClick={() => setShowEditCover(true)}
                >
                  <EditIcon />
                </span>
              )}

              {isOwnProfile && showEditCover && (
                <EditCoverModal
                  imageCover={profileUser.coverPicture?.url || noCover}
                  onClose={() => setShowEditCover(false)}
                  onSave={async (data) => {
                    if (!Object.keys(data).length) return;

                    const formData = new FormData();
                    if (data.coverPicture === null) {
                      formData.append("removeCoverPicture", "true");
                    } else if (data.coverPicture) {
                      formData.append("coverPicture", data.coverPicture);
                    }

                    try {
                      setLoading(true);
                      setShowEditCover(false);
                      const token = getToLocalStorage("user")?.token;
                      const config = requestConfig("PUT", formData, token);
                      const res = await fetch("/api/users/", config);
                      const result = await res.json();

                      if (result.errors) {
                        setError(result.errors);
                        return;
                      }

                      dispatch(updateUser(result));
                    } catch (err) {
                      console.error("Error updating cover:", err);
                    } finally {
                      setLoading(false);
                    }
                  }}
                />
              )}

              {isOwnProfile ? (
                <Link to="#">
                  <img
                    className={styles.profileUserImg}
                    src={profileUser.profilePicture?.url || noAvatar}
                    onClick={() => setShowEditProfile(true)}
                    alt="Profile"
                  />
                </Link>
              ) : (
                <img
                  className={styles.profileUserImg}
                  src={profileUser.profilePicture?.url || noAvatar}
                  alt="Profile"
                />
              )}

              {isOwnProfile && showEditProfile && (
                <EditProfileModal
                  imagePicture={profileUser.profilePicture?.url || noAvatar}
                  onClose={() => setShowEditProfile(false)}
                  onSave={async (data) => {
                    if (!Object.keys(data).length) return;

                    const formData = new FormData();
                    if (data.profilePicture === null) {
                      formData.append("removeProfilePicture", "true");
                    } else if (data.profilePicture) {
                      formData.append("profilePicture", data.profilePicture);
                    }

                    try {
                      setLoading(true);
                      setShowEditProfile(false);
                      const token = getToLocalStorage("user")?.token;
                      const config = requestConfig("PUT", formData, token);
                      const res = await fetch("/api/users/", config);
                      const result = await res.json();

                      if (result.errors) {
                        setError(result.errors);
                        return;
                      }

                      dispatch(updateUser(result));
                      setRefreshFeed((prev) => !prev);
                    } catch (err) {
                      console.error("Error updating profile:", err);
                    } finally {
                      setLoading(false);
                    }
                  }}
                />
              )}
            </div>

            <div className={styles.profileInfo}>
              <h4 className={styles.profileInfoName}>{profileUser.username}</h4>
              <span className={styles.profileInfoDesc}>
                {profileUser.description}
              </span>
            </div>
          </div>

          <div className={styles.profileRightBottom}>
            <Feed username={profileUser.username} refreshFeed={refreshFeed} />
            <Rightbar user={profileUser} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
