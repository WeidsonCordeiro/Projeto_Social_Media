//Hooks
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { updateUser } from "../../context/AuthActions";

//Components
import Online from "../online/Online";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import EditPersonalInfoModal from "../../components/editPersonalInfoModal/EditPersonalInfoModal";

//Css
import styles from "./Rightbar.module.css";

//Material UI
import EditIcon from "@mui/icons-material/Edit";
import { CircularProgress } from "@mui/material";
import { Add, FamilyRestroomTwoTone } from "@mui/icons-material";
import { Remove } from "@mui/icons-material";

//Utils
import { requestConfig, getToLocalStorage } from "../../utils/config";
import { getRelationshipLabel } from "../../utils/getRelationshipLabel";

//Icons assets
import noAvatar from "../../assets/person/noAvatar.webp";

const Rightbar = ({ user }) => {
  const [followed, setFollowed] = useState(false);
  const [showEditPersonalInfo, setShowEditPersonalInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user: userCredentials, dispatch } = useContext(AuthContext);
  const { onlineUsers } = useContext(SocketContext);

  const onlineFriends = userCredentials.followings.filter((friend) =>
    onlineUsers.some(
      (onlineUser) => onlineUser.userId.toString() === friend._id.toString()
    )
  );

  useEffect(() => {
    if (!userCredentials?.followings || !user?._id) return;

    setFollowed(
      userCredentials.followings.some((following) => following._id === user._id)
    );
  }, [userCredentials, user?._id]);

  const handleClick = async () => {
    const token = getToLocalStorage("user")?.token;
    const config = requestConfig("PUT", {}, token);

    try {
      setLoading(true);

      let res;

      if (followed) {
        res = await fetch(`/api/users/unfollows/${user._id}`, config);
      } else {
        res = await fetch(`/api/users/follows/${user._id}`, config);
      }

      const result = await res.json();

      if (result.errors) {
        setError(result.errors);
        return;
      }

      dispatch(updateUser(result));
    } catch (error) {
      console.error("Error fetching follows:", error);
      setError("Error fetching follows!");
    } finally {
      setLoading(false);
    }
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className={styles.birthdayContainer}>
          <img
            className={styles.birthdayImg}
            src="https://png.pngtree.com/png-clipart/20250418/original/pngtree-gift-box-red-gift-box-yellow-ribbon-png-image_20826676.png"
            alt=""
          />
          <span className={styles.birthdayText}>
            Pola Foster and 3 other frineds have a birthday today.
            <b> Pola Foster</b> and <b>other frieds have a birthday today</b>
          </span>
        </div>
        <img
          className={styles.rightbarAd}
          src="https://m.media-amazon.com/images/I/81-xWPjy4sL._UF1000,1000_QL80_.jpg"
          alt=""
        />
        <h4 className={styles.rightbarTitle}>Online Friends</h4>
        <ul className={styles.rightbarFriendList}>
          {onlineFriends.map((u) => (
            <Online key={u._id} users={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = ({ user }) => {
    return (
      <>
        {loading && (
          <div className="loading">
            <CircularProgress color="black" size={40} />
          </div>
        )}
        {user.username !== userCredentials.username && (
          <button className={styles.rightbarFollowButton} onClick={handleClick}>
            {followed ? (
              <>
                Unfollow <Remove />
              </>
            ) : (
              <>
                Follow <Add />
              </>
            )}
          </button>
        )}
        <h4 className={styles.rightbarTitle}>User information</h4>
        <div className={styles.rightbarInfo}>
          <div className={styles.rightbarInfoItem}>
            <span className={styles.rightbarInfoKey}>City:</span>
            <span className={styles.rightbarInfoValue}>
              {user.city ? user.city : "Not specified"}
            </span>
          </div>
          <div className={styles.rightbarInfoItem}>
            <span className={styles.rightbarInfoKey}>From:</span>
            <span className={styles.rightbarInfoValue}>
              {user.from ? user.from : "Not specified"}
            </span>
          </div>
          <div className={styles.rightbarInfoItem}>
            <span className={styles.rightbarInfoKey}>Relationship:</span>
            <span className={styles.rightbarInfoValue}>
              {getRelationshipLabel(user.relationship)}
            </span>
          </div>
          {userCredentials._id === user._id && (
            <span
              title="Edit Personal Information"
              className={styles.editIcon}
              onClick={() => setShowEditPersonalInfo(true)}
            >
              <EditIcon />
            </span>
          )}
          {showEditPersonalInfo && (
            <EditPersonalInfoModal
              user={user}
              onClose={() => setShowEditPersonalInfo(false)}
              onSave={async (data) => {
                try {
                  setLoading(true);
                  setShowEditPersonalInfo(false);
                  const token = getToLocalStorage("user")?.token;
                  const config = requestConfig("PUT", data, token);

                  const res = await fetch(`/api/users/`, config);

                  const result = await res.json();

                  if (result.errors) {
                    setError(result.errors);
                    setLoading(false);
                    return;
                  }

                  dispatch(updateUser(result));
                } catch (error) {
                  console.error("Error updating personal info:", error);
                  setLoading(false);
                  setError("Error updating personal info!");
                } finally {
                  setLoading(false);
                  setShowEditPersonalInfo(false);
                }
              }}
            />
          )}
        </div>
        <h4 className={styles.rightbarTitle}>User friends</h4>
        <div className={styles.rightbarFollowings}>
          {user.followings?.map((friend) => (
            <Link
              to={`/profile/${friend.username}`}
              key={friend._id}
              style={{ textDecoration: "none" }}
            >
              <div className={styles.rightbarFollowing}>
                <img
                  className={styles.rightbarFollowingImg}
                  src={
                    friend.profilePicture?.url
                      ? friend.profilePicture.url
                      : noAvatar
                  }
                  alt=""
                />
                <span className={styles.rightbarFollowingName}>
                  {friend.username}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className={styles.rightbarContainer}>
      <div className={styles.rightbarWrapper}>
        {user ? <ProfileRightbar user={user} /> : <HomeRightbar />}
      </div>
    </div>
  );
};

export default Rightbar;
