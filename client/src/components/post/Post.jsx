//Css
import styles from './Post.module.css';

//Images
import Person1 from '../../assets/person/1.jpg';

//Icons
import { MoreVert } from '@mui/icons-material';

const Post = () => {
  return (
    <div className={styles.postContainer}>
        <div className={styles.postWrapper}>
            <div className={styles.postTop}>
                <div className={styles.postTopLeft}>
                    <img className={styles.postProfileImg} src={Person1} alt="" />
                    <span className={styles.postUserName}>Safak kocaoglu</span>
                    <span className={styles.postDate}>5 minutes ago</span>
                </div>
                <div className={styles.postTopRight}>
                    <MoreVert />
                </div>
            </div>
            <div className={styles.postCenter}>
                <span className={styles.postText}>Hey! Its my first post :)</span>
                <img className={styles.postImg} src="https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
            </div>
            <div className={styles.postBottom}>
                <div className={styles.postBottomLeft}>
                    <img className={styles.likeIcon} src="https://images.vexels.com/media/users/3/223246/isolated/preview/a5e1b4a04c71beac7b6d7537dd007b35-like-icon-flat.png?w=360" alt="" />
                    <img className={styles.likeIcon} src="https://www.freeiconspng.com/thumbs/facebook-love-png/heart-facebook-reactions-png-0.png" alt="" />
                    <span className={styles.postLikeCounter}>32 people like it</span>
                </div>
                <div className={styles.postBottomRight}>
                    <span className={styles.postCommentText}>9 comments</span>
                </div>
            </div>
        </div>        
    </div>
  )
}

export default Post