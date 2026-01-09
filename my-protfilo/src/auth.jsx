
export const getToken = () => {
  try {
    return localStorage.getItem("token");
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem("token", token);
    }
  } catch (error) {
    console.error("Error setting token:", error);
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem("token");
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

export const getUserId = () => {
  try {
    return localStorage.getItem("user_id");
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
};

export const setUserId = (user_id) => {
  try {
    if (user_id) {
      localStorage.setItem("user_id", user_id);
    }
  } catch (error) {
    console.error("Error setting user ID:", error);
  }
};

export const removeUserId = () => {
  try {
    localStorage.removeItem("user_id");
  } catch (error) {
    console.error("Error removing user ID:", error);
  }
};


export const getUsername = () => {
  try {
    return localStorage.getItem("username");
  } catch (error) {
    console.error("Error getting username:", error);
    return null;
  }
};

export const setUsername = (username) => {
  try {
    if (username) {
      localStorage.setItem("username", username);
    }
  } catch (error) {
    console.error("Error setting username:", error);
  }
};

export const removeUsername = () => {
  try {
    localStorage.removeItem("username");
  } catch (error) {
    console.error("Error removing username:", error);
  }
};


export const logout = () => {
  removeToken();
  removeUserId();
  removeUsername();
  window.location.href = "/login";
};

export const isAuthenticated = () => {
  const token = getToken();
  return token !== null && token !== undefined && token !== "";
};



