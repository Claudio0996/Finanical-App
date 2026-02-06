const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const authRoutes = require("./features/auth/routes/authRoutes");
const categoryRoutes = require("./features/category/routes/categoryRoutes");
const accountRoutes = require("./features/account/routes/accountRoutes");
const transactionsRoutes = require("./features/transaction/routes/transactionRoutes");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(authRoutes);
app.use(categoryRoutes);
app.use(accountRoutes);
app.use(transactionsRoutes);

module.exports = { app };
