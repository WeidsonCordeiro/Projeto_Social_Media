//Components
import Online from '../online/Online';

//Css
import styles from './Rightbar.module.css';

//Data Dummy
import { Users } from '../../dummyData';

const Rightbar = ( { profile } ) => {

  const HomeRightbar = () => {
    return (
      <>
        <div className={styles.birthdayContainer}>
          <img className={styles.birthdayImg} src="https://png.pngtree.com/png-clipart/20250418/original/pngtree-gift-box-red-gift-box-yellow-ribbon-png-image_20826676.png" alt="" />
          <span className={styles.birthdayText}>Pola Foster and 3 other frineds have a birthday today.
          <b> Pola Foster</b> and <b>other frieds have a birthday today</b>
          </span>
        </div>
        <img className={styles.rightbarAd} src="https://m.media-amazon.com/images/I/81-xWPjy4sL._UF1000,1000_QL80_.jpg" alt="" />
        <h4 className={styles.rightbarTitle}>Online Friends</h4>
        <ul className={styles.rightbarFriendList}>
          {Users.map((u) => (
            <Online key={u.id} users={u} />
          ))}
        </ul> 
      </>
    )
  };

  const ProfileRightbar = () => {
      return (
        <>
          <h4 className={styles.rightbarTitle}>User information</h4>
          <div className={styles.rightbarInfo}>
            <div className={styles.rightbarInfoItem}>
              <span className={styles.rightbarInfoKey}>City:</span>
              <span className={styles.rightbarInfoValue}>New York</span>
            </div>
            <div className={styles.rightbarInfoItem}></div>
              <span className={styles.rightbarInfoKey}>From:</span>
              <span className={styles.rightbarInfoValue}>Madrid</span>
            <div className={styles.rightbarInfoItem}></div>
              <span className={styles.rightbarInfoKey}>Relationship:</span>
              <span className={styles.rightbarInfoValue}>Single</span>
            </div>
            <h4 className={styles.rightbarTitle}>User friends</h4>
            <div className={styles.rightbarFollowings}>
              <div className={styles.rightbarFollowing}>
                <img className={styles.rightbarFollowingImg} src="https://randomuser.me/api/portraits/women/44.jpg" alt="" />
                <span className={styles.rightbarFollowingName}>Jane Doe</span>
              </div>
              <div className={styles.rightbarFollowing}>
                <img className={styles.rightbarFollowingImg} src="https://randomuser.me/api/portraits/men/36.jpg" alt="" />
                <span className={styles.rightbarFollowingName}>John Smith</span>
              </div>
              <div className={styles.rightbarFollowing}>
                <img className={styles.rightbarFollowingImg} src="https://randomuser.me/api/portraits/women/65.jpg" alt="" />
                <span className={styles.rightbarFollowingName}>Emily Johnson</span>
              </div>
              <div className={styles.rightbarFollowing}>
                <img className={styles.rightbarFollowingImg} src="https://randomuser.me/api/portraits/men/22.jpg" alt="" />
                <span className={styles.rightbarFollowingName}>Michael Brown</span>
              </div>
              <div className={styles.rightbarFollowing}>
                <img className={styles.rightbarFollowingImg} src="https://randomuser.me/api/portraits/women/12.jpg" alt="" />
                <span className={styles.rightbarFollowingName}>Sarah Davis</span>
              </div>
              <div className={styles.rightbarFollowing}>
                <img className={styles.rightbarFollowingImg} src="https://randomuser.me/api/portraits/men/8.jpg" alt="" />
                <span className={styles.rightbarFollowingName}>David Wilson</span>
              </div>
                <div className={styles.rightbarFollowing}>
                <img className={styles.rightbarFollowingImg} src="https://randomuser.me/api/portraits/men/7.jpg" alt="" />
                <span className={styles.rightbarFollowingName}>David Wilson</span>
              </div>
                <div className={styles.rightbarFollowing}>
                <img className={styles.rightbarFollowingImg} src="https://randomuser.me/api/portraits/men/3.jpg" alt="" />
                <span className={styles.rightbarFollowingName}>David Wilson</span>
              </div>
            </div>
        </>
      )
  };

  return (
    <div className={styles.rightbarContainer}>
        <div className={styles.rightbarWrapper}>
          {profile ? <ProfileRightbar /> : <HomeRightbar />}
        </div>
    </div>
  )
}

export default Rightbar