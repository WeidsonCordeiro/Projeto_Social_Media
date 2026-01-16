export const loginStart = (userCredentials) => ({
  type: "LOGIN_START",
});

export const loginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});

export const loginFailure = (error) => ({
  type: "LOGIN_FAILURE",
  payload: error,
});

export const logout = (user) => ({
  type: "LOGOUT",
  payload: user,
});

export const follow = (user) => ({
  type: "FOLLOW",
  payload: user,
});
export const unfollow = (user) => ({
  type: "UNFOLLOW",
  payload: user,
});
