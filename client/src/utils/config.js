export const requestConfig = (method, data = null, token = null) => {
  let config;

  if (data instanceof FormData) {
    config = {
      method,
      body: data,
      headers: {},
    };
  } else if (method === "DELETE" || data === null) {
    config = {
      method,
      headers: {},
    };
  } else {
    config = {
      method,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

export const getToLocalStorage = (value) => {
  const item = localStorage.getItem(value);

  if (!item) return null;
  try {
    return JSON.parse(item);
  } catch (e) {
    return item;
  }
};

export const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeToLocalStorage = (value) => {
  localStorage.removeItem(value);
};
