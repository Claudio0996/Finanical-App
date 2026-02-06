const { Router } = require("express");
const { singleTransactionSchema } = require("../schemas/singleTransactionSchema");
const { multipleTransactionSchema } = require("../schemas/multipleTransacionSchema");
const { validate } = require("../../../middlewares/schemaValidations");
const { setUserId } = require("../../../middlewares/authMiddleware");
const TransactionController = require("../controllers/transactionController");

const router = Router();

router.post(
  "/transactions",
  validate(singleTransactionSchema),
  setUserId,
  TransactionController.createSingleTransaction,
);

router.post(
  "/transactions/installments",
  validate(multipleTransactionSchema),
  setUserId,
  TransactionController.createMultipleTransactions,
);

router.get("/transactions", setUserId, TransactionController.getTransactions);

router.put("/transactions/:id", setUserId, validate(singleTransactionSchema), TransactionController.updateTransaction);

router.delete("/transactions/:id", setUserId, TransactionController.deleteTransaction);

module.exports = router;
