const { Router } = require("express");
const { accountSchema } = require("../schemas/accountSchema");
const { validate } = require("../../../middlewares/schemaValidations");
const { setUserId } = require("../../../middlewares/authMiddleware");
const AccountController = require("../controllers/accountController");

const router = Router();

router.get("/accounts/:id", setUserId, AccountController.getAccount);

router.get("/accounts", setUserId, AccountController.getAccounts);

router.post("/accounts", validate(accountSchema), setUserId, AccountController.createAccount);

router.put("/accounts/:id", validate(accountSchema), setUserId, AccountController.updateAccount);

router.delete("/accounts/:id", setUserId, AccountController.deleteAccount);

module.exports = router;
