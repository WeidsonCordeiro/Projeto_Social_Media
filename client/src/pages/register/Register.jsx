//Css
import styles from './Register.module.css';

const Register = () => {
  return (
    <div className={styles.loginContainer}>
        <div className={styles.loginWrapper}>
            <div className={styles.loginLeft}>
                <h3 className={styles.loginLogo}>Social Media</h3>
                <span className={styles.loginDesc}>Connect with friends and the world around you on Social Media.</span>
            </div>
            <div className={styles.loginRight}>
                <div className={styles.loginBox}>
                    <input placeholder="User Name" type="email" className={styles.loginInput} />
                    <input placeholder="Email" type="password" className={styles.loginInput} />
                    <input placeholder="Password" type="password" className={styles.loginInput} />
                    <input placeholder="Password Again" type="password" className={styles.loginInput} />
                    <button className={styles.loginButton}>Sign Up</button>
                    <span className={styles.loginForgot}>Forgot Password?</span>
                    <button className={styles.loginRegisterButton}>Log into Account</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Register