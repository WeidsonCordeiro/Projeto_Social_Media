//Components
import Topbar from "../../components/Topbar/Topbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Feed from "../../components/Feed/Feed";
import Rightbar from "../../components/Rightbar/Rightbar";
import EditCoverModal from "../../components/editCoverModal/EditCoverModal";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

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
  const [showEditCover, setShowEditCover] = useState(false);
  const { username } = useParams();
  const { user: userCredentials } = useContext(AuthContext);

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
                  onSave={(data) => {
                    // aqui você chama sua API / dispatch
                    // onSave={async (data) => {
                    //   if (data.image === null) {
                    //     // remover cover
                    //   } else {
                    //     // upload nova imagem
                    //   }
                    // }}
                    console.log("Salvar cover:", data);
                    setShowEditCover(false);
                  }}
                />
              )}
              <Link to={`/profile/${user.username}`}>
                <img
                  className={styles.profileUserImg}
                  src={
                    user.profilePicture?.url
                      ? user.profilePicture.url
                      : noAvatar
                  }
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
