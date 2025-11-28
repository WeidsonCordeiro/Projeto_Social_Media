//Css
import styles from './Post.module.css';

//Icons
import { MoreVert } from '@mui/icons-material';

//Data dummy
import { Users } from '../../dummyData';

const Post = ( { post } ) => {

   const user = Users.filter((u) => u.id === post.userId)[0];

  return (
    <div className={styles.postContainer}>
        <div className={styles.postWrapper}>
            <div className={styles.postTop}>
                <div className={styles.postTopLeft}>
                    <img className={styles.postProfileImg} src={user.profilePicture} alt="" />
                    <span className={styles.postUserName}>{user.username}</span>
                    <span className={styles.postDate}>{post.date}</span>
                </div>
                <div className={styles.postTopRight}>
                    <MoreVert />
                </div>
            </div>
            <div className={styles.postCenter}>
                <span className={styles.postText}>{post.desc} </span>
                <img className={styles.postImg} src={post.photo} alt="" />
            </div>
            <div className={styles.postBottom}>
                <div className={styles.postBottomLeft}>
                    <img className={`${styles.likeIcon} ${styles.likeIconSmall}`} src="../../src/assets/icons/1.like.svg" alt="" />
                    <img className={styles.likeIcon} src="../../src/assets/icons/2.coracao.webp" alt="" />
                    <span className={styles.postLikeCounter}>{`${post.like} people like it`}</span>
                </div>
                <div className={styles.postBottomRight}>
                    <span className={styles.postCommentText}>{`${post.comment} comment(s)`}</span>
                </div>
            </div>
        </div>        
    </div>
  )
}

export default Post