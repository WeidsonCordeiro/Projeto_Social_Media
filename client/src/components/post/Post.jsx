//Components
import { useState } from 'react';

//Css
import styles from './Post.module.css';

//Icons
import { MoreVert } from '@mui/icons-material';

//Data dummy
import { Users } from '../../dummyData';

// Icons assets
import likeSvg from '../../assets/icons/1.like.svg';
import heartWebp from '../../assets/icons/2.coracao.webp';

const Post = ( { post } ) => {

const [like, setLike] = useState(post?.like ?? 0);
const [isLiked, setIsLiked] = useState(false);
const user = Users.filter((u) => u.id === post.userId)[0];

const likeHandler = () => {
    setIsLiked(prev => {
        setLike(l => (prev ? l - 1 : l + 1));
        return !prev;
    });
};

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
                    <img className={`${styles.likeIcon} ${styles.likeIconSmall}`} onClick={likeHandler} src={likeSvg} alt="like icon" />
                    <img className={styles.likeIcon} onClick={likeHandler} src={heartWebp} alt="heart icon" />
                    <span className={styles.postLikeCounter}>{`${like} people like it`}</span>
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