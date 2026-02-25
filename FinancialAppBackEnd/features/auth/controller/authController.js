const authService = require("../service/authService");
const { sendRefreshCookie } = require("../../../core/cookies");

exports.registerUser = async (req, res, next) => {
  const userData = req.body;
  try {
    const savedUser = await authService.registerUser({
      inputName: userData.name,
      inputEmail: userData.email,
      inputPassword: userData.password,
    });

    sendRefreshCookie(res, savedUser.refreshToken.token, savedUser.refreshToken.expiresAt);
    return res.status(201).json({
      success: true,
      message: "Usuário criado com sucesso",
      data: { user: savedUser.user, token: savedUser.token },
    });
  } catch (err) {
    console.log("[AuthControllerError]. Erro interno: ", err.message);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || "Erro interno",
      data: null,
    });
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const userData = req.body;
    const userAuth = await authService.loginUser({ inputEmail: userData.email, inputPassword: userData.password });

    sendRefreshCookie(res, userAuth.refreshToken.token, userAuth.refreshToken.expiresAt);
    res.status(200).json({
      success: true,
      message: "Usuário Logado com sucesso",
      data: { user: userAuth.user, token: userAuth.token },
    });
  } catch (err) {
    console.log("[AuthControllerError]. Erro interno: ", err.message);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || "Erro interno",
      data: null,
    });
  }
};

exports.refreshSession = async (req, res, next) => {
  console.log(req);
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
      throw new Error("Token não existe");
    }

    const newSession = await authService.refreshSession(oldRefreshToken);

    sendRefreshCookie(res, newSession.refreshToken.token, newSession.refreshToken.expiresAt);

    return res.status(200).json({
      success: true,
      message: "Token revalidado",
      data: { user: newSession.user, token: newSession.token },
    });
  } catch (err) {
    console.log("[AuthControllerError]. Erro interno: ", err.message);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || "Erro interno",
      data: null,
    });
  }
};
