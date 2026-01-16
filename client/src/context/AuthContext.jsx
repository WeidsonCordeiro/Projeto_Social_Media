//Hooks
import { createContext, useReducer, useEffect } from "react";

//Components
import AuthReducer from "./AuthReducer.jsx";
import { logout } from "./AuthActions";

//Utils
import {
  getToLocalStorage,
  saveToLocalStorage,
  removeToLocalStorage,
} from "../utils/config.js";
import { getTokenExpiration } from "../utils/token";

const userFromStorage = getToLocalStorage("user");

const INITIAL_STATE = {
  user: userFromStorage || null,
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    const storedUser = getToLocalStorage("user");

    if (state.user) {
      if (JSON.stringify(storedUser) !== JSON.stringify(state.user)) {
        saveToLocalStorage("user", state.user);
      }
    } else {
      removeToLocalStorage("user");
    }
  }, [state.user]);

  // Auto Logout on Token Expiration
  useEffect(() => {
    if (!state.user?.token) return;

    const expirationTime = getTokenExpiration(state.user.token);
    if (!expirationTime) return;

    const timeLeft = expirationTime - Date.now();

    if (timeLeft <= 0) {
      dispatch(logout());
      return;
    }

    const timer = setTimeout(() => {
      dispatch(logout());
    }, timeLeft);

    return () => clearTimeout(timer);
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
