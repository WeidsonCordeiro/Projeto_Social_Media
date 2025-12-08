//Components
import Topbar from '../../components/Topbar/Topbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import Feed from '../../components/Feed/Feed'
import Rightbar from '../../components/Rightbar/Rightbar'

//Css
import styles from "./Profile.module.css";

//Profile Page
import ProfileImage from '../../assets/person/2.webp';
import CoverImage from '../../assets/img/cover.webp';

const Profile = () => {
  return (
      <>
      < Topbar />
      <div className={styles.profileContainer}>
        < Sidebar />
        <div className={styles.profileRight}>
          <div className={styles.profileRightTop}>
            <div className={styles.profileCover}>
              <img className={styles.profileCoverImg} src={CoverImage} alt="" />
              <img className={styles.profileUserImg} src={ProfileImage} alt="" />
            </div>
            <div className={styles.profileInfo}>
              <h4 className={styles.profileInfoName}>John Carter</h4>
              <span className={styles.profileInfoDesc}>Hello my friends!</span>
              {/* <div className={styles.profileInfoDetails}>
                <div className={styles.profileInfoItem}>
                  <PermIdentity className={styles.profileInfoIcon} />
                  <span className={styles.profileInfoText}>johndoe99</span>
                </div>
              </div> */}
            </div>
          </div>
          <div className={styles.profileRightBottom}>
            < Feed /> 
            <Rightbar profile/>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile