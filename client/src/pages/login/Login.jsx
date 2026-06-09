//Hooks
import { useState, useEffect } from "react";
import { Form, Link } from "react-router-dom";
import { useRef, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  stopLoading,
  clearError,
} from "../../context/AuthActions";

//Utils
import { requestConfig, API_URL } from "../../utils/config";
import { mapValidationErrors } from "../../utils/mapValidationErrors";

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
  const [validationErrors, setValidationErrors] = useState({});
  const { isFetching, error, dispatch } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userCredentials = {
      email,
      password,
    };

    dispatch(loginStart());
    const config = requestConfig("POST", userCredentials, null);
    try {
      const res = await fetch(`${API_URL}/api/users/login`, config);
      const result = await res.json();

      if (result.errors) {
        setValidationErrors(mapValidationErrors(result.errors));
        dispatch(stopLoading());
        return;
      }

      if (result.error) {
        setValidationErrors({});
        dispatch(loginFailure(result.error));
        return;
      }

      setValidationErrors({});
      setEmail("");
      setPassword("");
      dispatch(loginSuccess(result));
    } catch (error) {
      dispatch(loginFailure(error.message || "Something went wrong!"));
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <div className={styles.loginContainer}>
      {isFetching && (
        <div className="loading">
          <CircularProgress color="black" size={40} />
        </div>
      )}
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
            {validationErrors.email && (
              <div className={styles.errormsg}>
                <p>{validationErrors.email}</p>
              </div>
            )}
            <div className={styles.inputWrapper}>
              <input
                className={styles.loginInput}
                type={showPassword ? "text" : "password"}
                value={password}
                minLength={6}
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
            {validationErrors.password && (
              <div className={styles.errormsg}>
                <p>{validationErrors.password}</p>
              </div>
            )}
            {error && Object.keys(validationErrors).length === 0 && (
              <div className={styles.errormsg}>
                <p>{error}</p>
              </div>
            )}
            {!isFetching && (
              <button className={styles.loginButton} type="submit">
                Log In
              </button>
            )}
            {isFetching && (
              <button className={styles.loginButton} type="submit" disabled>
                wait...
              </button>
            )}
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
