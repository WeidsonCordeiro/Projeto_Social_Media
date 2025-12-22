//Components
import { useRef, useContext } from "react";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";

//Material UI
import { CircularProgress } from "@mui/material";

//Css
import styles from "./Login.module.css";

const Login = () => {
  const email = useRef();
  const password = useRef();
  const { user, isFetching, error, dispatch } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };

  console.log(user);

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginWrapper}>
        <div className={styles.loginLeft}>
          <h3 className={styles.loginLogo}>Social Media</h3>
          <span className={styles.loginDesc}>
            Connect with friends and the world around you on Social Media.
          </span>
        </div>
        <div className={styles.loginRight}>
          <div className={styles.loginBox} onSubmit={handleSubmit}>
            <input
              placeholder="Email"
              type="email"
              className={styles.loginInput}
              required
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              className={styles.loginInput}
              required
              min={6}
              ref={password}
            />
            <button
              type="submit"
              className={styles.loginButton}
              disabled={isFetching}
            >
              {isFetching ? (
                <CircularProgress color="white" size={20} />
              ) : (
                "Log In"
              )}
            </button>
            <span className={styles.loginForgot}>Forgot Password?</span>
            <button className={styles.loginRegisterButton}>
              {isFetching ? (
                <CircularProgress color="white" size={20} />
              ) : (
                "Create a New Account"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
