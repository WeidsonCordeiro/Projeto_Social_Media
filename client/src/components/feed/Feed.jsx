//Components
import Post from '../post/Post';
import Share from '../share/Share';

//Css
import styles from './Feed.module.css';

//Data dummy
import { Posts } from '../../dummyData';


const feed = () => {
  return (
    <div className={styles.feedContainer}>
      <div className={styles.feedWrapper}>
        <Share />
        {Posts.map((p) => (
          <Post key={p.id} post={p} />
        ))}

      </div>
    </div>
  )
}

export default feed