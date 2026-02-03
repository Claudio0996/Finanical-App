const AccessTokenService = require("../features/auth/service/accessTokenService");

const setUserId = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error("Token não encontrado");
    }

    const [bearer, token] = req.headers.authorization.split(" ");

    if (bearer !== "Bearer") {
      throw new Error("Modo de autenticação inválida");
    }

    if (!token) {
      throw new Error("Token não existe");
    }

    const userId = AccessTokenService.verifyAccessToken(token).id;

    req.userId = userId;
    next();
  } catch (err) {
    console.log(err.message);
    return res.status(401).json({
      success: false,
      message: "token inválido ou expirado",
      data: null,
    });
  }
};
