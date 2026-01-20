const { Router } = require("express");
const { User, loginSchema } = require("../../user/schemas/userSchema");
const { validate } = require("../../../middlewares/userValidations");
const { loginUser, registerUser, refreshSession } = require("../controller/authController");

const router = Router();

router.post("/register", validate(User), registerUser);

router.post("/login", validate(loginSchema), loginUser);

router.post("/refresh", refreshSession);

module.exports = router;
