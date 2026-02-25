const { Router } = require("express");
const { setUserId } = require("../../../middlewares/authMiddleware");

const DashboardController = require("../controller/dashboardController");

const router = Router();

router.get("/dashboard-summary", setUserId, DashboardController.getSummary);

module.exports = router;
