export const loginCall = async (userCredentials, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCredentials),
    });
    const data = await res.json();
    if (res.ok) {
      dispatch({ type: "LOGIN_SUCCESS", payload: data });
    } else {
      dispatch({ type: "LOGIN_FAILURE", payload: data });
    }
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};
