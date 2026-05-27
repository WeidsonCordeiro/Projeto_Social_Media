//Hooks
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

//Components
import { AuthContext } from "../../context/AuthContext";
import { loginSuccess } from "../../context/AuthActions";

//Utils
import { requestConfig } from "../../utils/config";
import { mapValidationErrors } from "../../utils/mapValidationErrors";

//Material UI
import { CircularProgress } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

//Css
import styles from "./Register.module.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const user = {
      username: username.toLowerCase(),
      email,
      password,
      confirmPassword,
    };

    const config = requestConfig("POST", user, null);
    try {
      const res = await fetch(`/api/users/register`, config);
      const result = await res.json();

      if (result.errors) {
        setValidationErrors(mapValidationErrors(result.errors));
        setLoading(false);
        return;
      }

      if (result.error) {
        setValidationErrors({});
        setError(result.error);
        return;
      }

      // Clear fields
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setValidationErrors({});

      // Redirects to Login
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
      setError("Error registering. Please try again.!");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {loading && (
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
        <form className={styles.loginRight} onSubmit={handleSubmit} noValidate>
          <div className={styles.loginBox}>
            <input
              placeholder="User Name"
              type="text"
              className={styles.loginInput}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {validationErrors.username && (
              <div className={styles.errormsg}>
                <p>{validationErrors.username}</p>
              </div>
            )}
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
            <div className={styles.inputWrapper}>
              <input
                className={styles.loginInput}
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                minLength={6}
                placeholder="Password Again"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className={`${styles.visibilityIcon} ${
                  showConfirmPassword ? styles.active : ""
                }`}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? (
                  <VisibilityOffIcon />
                ) : (
                  <VisibilityIcon />
                )}
              </span>
            </div>
            {validationErrors.confirmPassword && (
              <div className={styles.errormsg}>
                <p>{validationErrors.confirmPassword}</p>
              </div>
            )}
            {error && Object.keys(validationErrors).length === 0 && (
              <div className={styles.errormsg}>
                <p>{error}</p>
              </div>
            )}
            {!loading && (
              <button className={styles.loginButton} type="submit">
                Sign Up
              </button>
            )}
            {loading && (
              <button className={styles.loginButton} type="submit" disabled>
                wait...
              </button>
            )}
            <span className={styles.loginForgot}>Forgot Password?</span>
            <Link to="/login">
              <button type="button" className={styles.loginRegisterButton}>
                Log into Account
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
