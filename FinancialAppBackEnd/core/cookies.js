exports.sendRefreshCookie = (res, refreshToken, expiration) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/",
    expires: expiration,
  });
};
