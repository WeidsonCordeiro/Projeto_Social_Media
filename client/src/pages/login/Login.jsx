//Hooks
import { useState, useEffect, use } from "react";
import { Form, Link } from "react-router-dom";
import { useRef, useContext } from "react";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";

//Material UI
import { CircularProgress } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

//Css
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
            <div className={styles.inputWrapper}>
              <input
                className={styles.loginInput}
                type={showPassword ? "text" : "password"}
                value={password}
                min={6}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className={`${styles.visibilityIcon} ${
                  showPassword ? styles.active : ""
                }`}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </span>
            </div>
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
