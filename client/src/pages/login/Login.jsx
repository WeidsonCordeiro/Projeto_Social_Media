//Hooks
import { useState, useEffect, use } from "react";
import { Form, Link } from "react-router-dom";
import { useRef, useContext } from "react";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";

//Material UI
import { CircularProgress } from "@mui/material";

//Css
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, isFetching, error, dispatch } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    const userCredentials = {
      email,
      password,
    };

    loginCall(userCredentials, dispatch);
  };

  useEffect(() => {
    if (user && !error) {
      setEmail("");
      setPassword("");
    }
  }, [user, error]);

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
          <form className={styles.loginBox} onSubmit={handleSubmit} noValidate>
            <input
              placeholder="Email"
              type="email"
              className={styles.loginInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              className={styles.loginInput}
              min={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            <Link to="/register">
              <button className={styles.loginRegisterButton}>
                Create a New Account
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
