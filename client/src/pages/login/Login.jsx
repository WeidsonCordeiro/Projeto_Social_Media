//Hooks
import { useState, useEffect } from "react";
import { Form, Link } from "react-router-dom";
import { useRef, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} from "../../context/AuthActions";

//Utils
import { requestConfig } from "../../utils/config";

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
  const { user, isFetching, error, dispatch } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userCredentials = {
      email,
      password,
    };

    dispatch(loginStart());
    const config = requestConfig("POST", userCredentials, null);
    try {
      const res = await fetch(`/api/users/login`, config);
      const data = await res.json();

      if (data.errors || !res.ok) {
        dispatch(loginFailure(data.errors));
        console.log("Login error response:", data.errors);
        const errorsObj = {};

        data.errors.forEach((err) => {
          if (err.toLowerCase().includes("e-mail")) {
            errorsObj.email = err;
          }

          if (err.toLowerCase().includes("senha")) {
            errorsObj.password = err;
          }
        });
        console.log("Login erros:", errorsObj);
        setValidationErrors(errorsObj);

        return;
      }

      setValidationErrors({});
      dispatch(loginSuccess(data));
    } catch (error) {
      dispatch(loginFailure(error.message));
      console.log(error);
    }
  };

  useEffect(() => {
    if (user && !error) {
      setEmail("");
      setPassword("");
    }
  }, [user, error]);

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
            {validationErrors.password && (
              <div className={styles.errormsg}>
                <p>{validationErrors.password}</p>
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
