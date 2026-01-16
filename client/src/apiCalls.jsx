//Hooks
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} from "./context/AuthActions";

//Utils
import { requestConfig } from "./utils/config";

export const loginCall = async (userCredentials, dispatch) => {
  dispatch(loginStart());
  const config = requestConfig("POST", userCredentials, null);
  try {
    const res = await fetch(`/api/users/login`, config);
    const data = await res.json();

    if (data.errors || !res.ok) {
      throw new Error(data.errors || "Erro ao fazer login");
    }
    dispatch(loginSuccess(data));
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

export const logoutCall = (dispatch) => {
  dispatch(logout());
};
