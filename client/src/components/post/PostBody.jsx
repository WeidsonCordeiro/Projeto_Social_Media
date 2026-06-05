//Css
import styles from "./PostBody.module.css";

const PostBody = ({ post }) => {
  return (
    <div className={styles.postCenter}>
      <span>{post.description}</span>
      <img className={styles.postImg} src={post.img} alt={post.description} />
    </div>
  );
};

export default PostBody;
2;
