//Hooks
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

//Components
import Online from "../online/Online";
import { AuthContext } from "../../context/AuthContext";
import { follow, unfollow } from "../../context/AuthActions";
import EditPersonalInfoModal from "../../components/editPersonalInfoModal/EditPersonalInfoModal";

import { Add, FamilyRestroomTwoTone } from "@mui/icons-material";
import { Remove } from "@mui/icons-material";

//Css
import styles from "./Rightbar.module.css";

//Material UI
import EditIcon from "@mui/icons-material/Edit";

//Utils
import { requestConfig, getToLocalStorage } from "../../utils/config";
import { getRelationshipLabel } from "../../utils/getRelationshipLabel";

//Icons assets
import noAvatar from "../../assets/person/noAvatar.webp";

const Rightbar = ({ user }) => {
  const [friends, setFriends] = useState([]);
  const [followed, setFollowed] = useState(false);
  const [showEditPersonalInfo, setShowEditPersonalInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user: userCredentials, dispatch } = useContext(AuthContext);

  useEffect(() => {
    if (!userCredentials?.followings || !user?._id) return;

    setFollowed(userCredentials.followings.includes(user._id));
  }, [userCredentials, user?._id]);

  useEffect(() => {
    if (!user?._id) return;

    const fetchFriends = async () => {
      const config = requestConfig("GET", null, null);
      try {
        setLoading(true);
        const res = await fetch(`/api/users/friends/${user._id}`, config);
        const result = await res.json();
        if (result.errors) {
          setError(result.errors);
          return;
        }
        setFriends(result);
      } catch (error) {
        console.error("Error fetching friends:", error);
        setFriends([]);
        setError("Error fetching friends!");
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [user]);

  const handleClick = async () => {
    const token = getToLocalStorage("user")?.token;
    const config = requestConfig("PUT", { userId: userCredentials._id }, token);

    try {
      setLoading(true);
      let res;
      let result;
      console.log("Followed state before click:", followed);
      if (followed) {
        res = await fetch(`/api/users/unfollows/${user._id}`, config);

        if (!res.ok) {
          setError("Error unfollowing user");
          return;
        }
        result = await res.json();
        if (result.errors) {
          setError(result.errors);
          return;
        }
        dispatch(unfollow(user._id));
      } else {
        res = await fetch(`/api/users/follows/${user._id}`, config);
        if (!res.ok) {
          setError("Error following user");
          return;
        }
        result = await res.json();
        if (result.errors) {
          setError(result.errors);
          return;
        }
        dispatch(follow(user._id));
      }
    } catch (error) {
      console.error("Error fetching follows:", error);
      setFollowed(false);
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
          {friends.map((u) => (
            <Online key={u.id} users={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = ({ user }) => {
    return (
      <>
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
            <span className={styles.rightbarInfoValue}>{user.city}</span>
          </div>
          <div className={styles.rightbarInfoItem}>
            <span className={styles.rightbarInfoKey}>From:</span>
            <span className={styles.rightbarInfoValue}>{user.from}</span>
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
              // onSave={async (data) => {
              //   if (Object.keys(data).length > 0) {
              //     const formData = new FormData();

              //     if (data.coverPicture === null) {
              //       formData.append("removeCoverPicture", "true");
              //     } else if (data.coverPicture) {
              //       formData.append("coverPicture", data.coverPicture);
              //     }

              //     try {
              //       setLoading(true);
              //       const token = getToLocalStorage("user")?.token;
              //       const config = requestConfig("PUT", formData, token);

              //       const res = await fetch(`/api/users/`, config);

              //       const result = await res.json();

              //       if (result.errors) {
              //         setError(result.errors);
              //         setLoading(false);
              //         return;
              //       }

              //       setUser(result);
              //       setShowEditCover(false);
              //     } catch (error) {
              //       console.error("Error updating cover users:", error);
              //       setLoading(false);
              //       setError("Error updating cover users!");
              //       setUser({});
              //     } finally {
              //       setLoading(false);
              //       setShowEditCover(false);
              //     }
              //   }
              // }}
            />
          )}
        </div>
        <h4 className={styles.rightbarTitle}>User friends</h4>
        {friends.map((friend) => (
          <Link
            to={`/profile/${friend.username}`}
            key={friend._id}
            style={{ textDecoration: "none" }}
          >
            <div className={styles.rightbarFollowings}>
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
            </div>
          </Link>
        ))}
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
