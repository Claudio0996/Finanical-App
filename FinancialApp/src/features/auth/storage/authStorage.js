export const storage = {
  saveAuth: (data) => {
    localStorage.setItem("data", JSON.stringify(data));
  },
  loadAuth: () => {
    try {
      const raw = localStorage.getItem("data");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  clearAuth: () => {
    localStorage.removeItem("data");
  },
};
