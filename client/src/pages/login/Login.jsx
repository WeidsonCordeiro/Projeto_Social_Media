//Css
import styles from './Login.module.css';

const Login = () => {
  return (
    <div className={styles.loginContainer}>
        <div className={styles.loginWrapper}>
            <div className={styles.loginLeft}>
                <h3 className={styles.loginLogo}>Social Media</h3>
                <span className={styles.loginDesc}>Connect with friends and the world around you on Social Media.</span>
            </div>
            <div className={styles.loginRight}>
                <div className={styles.loginBox}>
                    <input placeholder="Email" type="email" className={styles.loginInput} />
                    <input placeholder="Password" type="password" className={styles.loginInput} />
                    <button className={styles.loginButton}>Log In</button>
                    <span className={styles.loginForgot}>Forgot Password?</span>
                    <button className={styles.loginRegisterButton}>Create a New Account</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login