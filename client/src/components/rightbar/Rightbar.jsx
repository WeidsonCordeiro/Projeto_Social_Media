//Css
import styles from './Rightbar.module.css';

const Rightbar = () => {
  return (
    <div className={styles.rightbarContainer}>
        <div className={styles.rightbarWrapper}>
          <div className={styles.birthdayContainer}>
            <img className={styles.birthdayImg} src="https://png.pngtree.com/png-clipart/20250418/original/pngtree-gift-box-red-gift-box-yellow-ribbon-png-image_20826676.png" alt="" />
            <span className={styles.birthdayText}>Pola Foster and 3 other frineds have a birthday today.
            <b> Pola Foster</b> and <b>other frieds have a birthday today</b>
            </span>
          </div>
          <img className={styles.rightbarAd} src="https://m.media-amazon.com/images/I/81-xWPjy4sL._UF1000,1000_QL80_.jpg" alt="" />
          <h4 className={styles.rightbarTitle}>Online Friends</h4>
          <ul className={styles.rightbarFriendList}>
            <li className={styles.rightbarFriend}>
              <div className={styles.rightbarProfileImgContainer}>
                <img className={styles.rightbarProfileImg} src="https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_JN2xjsFOQGWUeY1g7FpdnAPk0nFv3X6T.jpg" alt="" />
                <span className={styles.rightbarOnline}></span>
              </div>
              <span className={styles.rightbarUsername}>John Carter</span>
            </li>
            <li className={styles.rightbarFriend}>
              <div className={styles.rightbarProfileImgContainer}>
                <img className={styles.rightbarProfileImg} src="https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_JN2xjsFOQGWUeY1g7FpdnAPk0nFv3X6T.jpg" alt="" />
                <span className={styles.rightbarOnline}></span>
              </div>   
              <span className={styles.rightbarUsername}>John Carter</span>
            </li>
            <li className={styles.rightbarFriend}>
              <div className={styles.rightbarProfileImgContainer}>
                <img className={styles.rightbarProfileImg} src="https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_JN2xjsFOQGWUeY1g7FpdnAPk0nFv3X6T.jpg" alt="" />
                <span className={styles.rightbarOnline}></span>
              </div>   
              <span className={styles.rightbarUsername}>John Carter</span>
            </li> 
            <li className={styles.rightbarFriend}>
              <div className={styles.rightbarProfileImgContainer}>
                <img className={styles.rightbarProfileImg} src="https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_JN2xjsFOQGWUeY1g7FpdnAPk0nFv3X6T.jpg" alt="" />
                <span className={styles.rightbarOnline}></span>
              </div>   
              <span className={styles.rightbarUsername}>John Carter</span>
            </li> 
          </ul>
        </div>
    </div>
  )
}

export default Rightbar