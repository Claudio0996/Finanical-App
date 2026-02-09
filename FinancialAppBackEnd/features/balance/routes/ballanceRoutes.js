const { Router } = require("express");
const { TransactionQuerySchema } = require("../../transaction/schemas/transactionQuery.schema");
const { setUserId } = require("../../../middlewares/authMiddleware");
const { parseTransactionFilter } = require("../../../middlewares/parseTransactionFilters");
const BalanceController = require("../controllers/balanceController");

const router = Router();

router.get("/balance", setUserId, parseTransactionFilter(TransactionQuerySchema), BalanceController.getBalance);

module.exports = router;
