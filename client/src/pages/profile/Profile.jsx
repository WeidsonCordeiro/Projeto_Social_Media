//Components
import Topbar from "../../components/Topbar/Topbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Feed from "../../components/Feed/Feed";
import Rightbar from "../../components/Rightbar/Rightbar";
import EditCoverModal from "../../components/editCoverModal/EditCoverModal";
import EditProfileModal from "../../components/editProfileModal/EditProfileModal";

//Hooks
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { updateUser } from "../../context/AuthActions";

//Hooks
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

//Css
import styles from "./Profile.module.css";

//Material UI
import EditIcon from "@mui/icons-material/Edit";

//Icons assets
import noAvatar from "../../assets/person/noAvatar.webp";
import noCover from "../../assets/person/noCover.webp";

//Utils
import { requestConfig, getToLocalStorage } from "../../utils/config";

const Profile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditCover, setShowEditCover] = useState(false);
  const { username } = useParams();
  const { user: userCredentials, dispatch } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      const token = getToLocalStorage("user")?.token;
      const config = requestConfig("GET", null, token);
      try {
        const res = await fetch(
          `/api/users/username/${encodeURIComponent(username)}`,
          config,
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
                src={user.coverPicture?.url ? user.coverPicture.url : noCover}
                alt=""
              />
              {userCredentials._id === user._id && (
                <span
                  title="Edit Cover Picture"
                  className={styles.editIcon}
                  onClick={() => setShowEditCover(true)}
                >
                  <EditIcon />
                </span>
              )}
              {showEditCover && (
                <EditCoverModal
                  imageCover={
                    user.coverPicture?.url ? user.coverPicture.url : noCover
                  }
                  onClose={() => setShowEditCover(false)}
                  onSave={async (data) => {
                    if (Object.keys(data).length > 0) {
                      const formData = new FormData();

                      if (data.coverPicture === null) {
                        formData.append("removeCoverPicture", "true");
                      } else if (data.coverPicture) {
                        formData.append("coverPicture", data.coverPicture);
                      }

                      try {
                        setLoading(true);
                        const token = getToLocalStorage("user")?.token;
                        const config = requestConfig("PUT", formData, token);

                        const res = await fetch(`/api/users/`, config);

                        const result = await res.json();

                        if (result.errors) {
                          setError(result.errors);
                          setLoading(false);
                          return;
                        }

                        setUser(result);
                        setShowEditCover(false);
                        dispatch(updateUser(result));
                      } catch (error) {
                        console.error("Error updating cover user:", error);
                        setLoading(false);
                        setError("Error updating cover user!");
                        setUser({});
                      } finally {
                        setLoading(false);
                        setShowEditCover(false);
                      }
                    }
                  }}
                />
              )}
              {userCredentials._id === user._id ? (
                <Link to="#">
                  <img
                    title="Edit Profile Picture"
                    onClick={() => setShowEditProfile(true)}
                    className={styles.profileUserImg}
                    src={
                      user.profilePicture?.url
                        ? user.profilePicture.url
                        : noAvatar
                    }
                    alt="Profile Picture"
                  />
                </Link>
              ) : (
                <img
                  className={styles.profileUserImg}
                  src={
                    user.profilePicture?.url
                      ? user.profilePicture.url
                      : noAvatar
                  }
                  alt="Profile Picture"
                />
              )}
              {showEditProfile && (
                <EditProfileModal
                  imagePicture={
                    user.profilePicture?.url
                      ? user.profilePicture.url
                      : noAvatar
                  }
                  onClose={() => setShowEditProfile(false)}
                  onSave={async (data) => {
                    if (Object.keys(data).length > 0) {
                      const formData = new FormData();

                      if (data.profilePicture === null) {
                        formData.append("removeProfilePicture", "true");
                      } else if (data.profilePicture) {
                        formData.append("profilePicture", data.profilePicture);
                      }

                      try {
                        setLoading(true);
                        const token = getToLocalStorage("user")?.token;
                        const config = requestConfig("PUT", formData, token);

                        const res = await fetch(`/api/users/`, config);

                        const result = await res.json();

                        if (result.errors) {
                          setError(result.errors);
                          setLoading(false);
                          return;
                        }

                        setUser(result);
                        setShowEditProfile(false);
                        dispatch(updateUser(result));
                      } catch (error) {
                        console.error("Error updating profile user:", error);
                        setLoading(false);
                        setError("Error updating profile user!");
                        setUser({});
                      } finally {
                        setLoading(false);
                        setShowEditProfile(false);
                      }
                    }
                  }}
                />
              )}
            </div>
            <div className={styles.profileInfo}>
              <h4 className={styles.profileInfoName}>{user.username}</h4>
              <span className={styles.profileInfoDesc}>{user.description}</span>
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
