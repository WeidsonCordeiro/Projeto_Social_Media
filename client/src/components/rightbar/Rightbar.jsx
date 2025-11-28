//Components
import Online from '../online/Online';

//Css
import styles from './Rightbar.module.css';

//Data Dummy
import { Users } from '../../dummyData';

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
            {Users.map((u) => (
              <Online key={u.id} users={u} />
            ))}
          </ul>          
        </div>
    </div>
  )
}

export default Rightbar