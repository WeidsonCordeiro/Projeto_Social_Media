//Assets Icons
import likeSvg from "../../assets/icons/1.like.svg";
import heartWebp from "../../assets/icons/2.coracao.webp";

//Css
import styles from "./PostActions.module.css";

const PostActions = ({ likes, commentsCount, onLike, onToggleComments }) => {
  return (
    <div className={styles.postBottom}>
      <div className={styles.postBottomLeft}>
        <img
          className={styles.likeIconSmall}
          src={likeSvg}
          alt=""
          onClick={onLike}
        />
        <img
          className={styles.likeIcon}
          src={heartWebp}
          alt=""
          onClick={onLike}
        />
        <span>{likes.length} people like it</span>
      </div>

      <div>
        <span className={styles.postCommentText} onClick={onToggleComments}>
          {commentsCount} comment(s)
        </span>
      </div>
    </div>
  );
};

export default PostActions;
