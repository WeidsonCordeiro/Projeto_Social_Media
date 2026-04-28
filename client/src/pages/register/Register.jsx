//Hooks
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

//Components
import { AuthContext } from "../../context/AuthContext";
import { loginSuccess } from "../../context/AuthActions";

//Utils
import { requestConfig } from "../../utils/config";

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
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = {
      username,
      email,
      password,
      confirmPassword,
    };

    const config = requestConfig("POST", user, null);
    try {
      const res = await fetch(`/api/users/register`, config);
      const result = await res.json();

      if (result.errors) {
        setError(result.errors);
        setLoading(false);
        return;
      }

      //dispatch(loginSuccess(result));

      // Limpa campos
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Redireciona para Login
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
      setError("Erro ao registar. Tente novamente!");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginWrapper}>
        <div className={styles.loginLeft}>
          <h3 className={styles.loginLogo}>Social Media</h3>
          <span className={styles.loginDesc}>
            Connect with friends and the world around you on Social Media.
          </span>
        </div>
        <form className={styles.loginRight} onSubmit={handleSubmit}>
          <div className={styles.loginBox}>
            <input
              placeholder="User Name"
              type="text"
              className={styles.loginInput}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
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
                  showPassword ? "active" : ""
                }`}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </span>
            </div>
            <div className={styles.inputWrapper}>
              <input
                className={styles.loginInput}
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                min={6}
                placeholder="Password Again"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className={`${styles.visibilityIcon} ${
                  showConfirmPassword ? "active" : ""
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
            <button
              type="submit"
              className={styles.loginButton}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress color="white" size={20} />
              ) : (
                "Sign Up"
              )}
            </button>
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
