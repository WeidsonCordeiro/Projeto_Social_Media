//Hooks
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

//Components
import Online from "../online/Online";
import { AuthContext } from "../../context/AuthContext";
import { follow, unfollow } from "../../context/AuthActions";

import { Add, FamilyRestroomTwoTone } from "@mui/icons-material";
import { Remove } from "@mui/icons-material";

//Css
import styles from "./Rightbar.module.css";

//Utils
import { requestConfig, getToLocalStorage } from "../../utils/config";
import { userImageUrl } from "../../utils/imageUrl";

//Icons assets
import noPicture from "../../assets/person/noPicture.webp";

const Rightbar = ({ user }) => {
  const [friends, setFriends] = useState([]);
  const [followed, setFollowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user: currentUser, dispatch } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser?.followings || !user?._id) return;

    setFollowed(currentUser.followings.includes(user._id));
  }, [currentUser, user?._id]);

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
    const config = requestConfig("PUT", { userId: currentUser._id }, token);

    console.log(user);
    console.log(currentUser);
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
        {user.username !== currentUser.username && (
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
          <div className={styles.rightbarInfoItem}></div>
          <span className={styles.rightbarInfoKey}>From:</span>
          <span className={styles.rightbarInfoValue}>{user.from}</span>
          <div className={styles.rightbarInfoItem}></div>
          <span className={styles.rightbarInfoKey}>Relationship:</span>
          <span className={styles.rightbarInfoValue}>{user.relationship}</span>
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
                    friend.profilePicture
                      ? userImageUrl(friend.profilePicture)
                      : noPicture
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
