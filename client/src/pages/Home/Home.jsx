//Components
import Topbar from '../../components/Topbar/Topbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import Feed from '../../components/Feed/Feed'
import Rightbar from '../../components/Rightbar/Rightbar'

//Css
import styles from './Home.module.css'


const Home = () => {
  return (
    <>
    < Topbar />
    <div className={styles.homeContainer}>
      < Sidebar />
      < Feed /> 
      <Rightbar />
    </div>
    </>
  )
}

export default Home