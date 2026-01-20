export default async function RefreshSession() {
  try {
    const response = await fetch("/api/refresh", {
      method: "POST",
      credentials: "include",
    });
    const resData = await response.json();

    if (!resData.success) {
      throw new Error(resData.message);
    }

    return resData;
  } catch (err) {
    throw err;
  }
}
