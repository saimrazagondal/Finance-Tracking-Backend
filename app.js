const express = require("express");
const morgan = require("morgan");
const { globalErrorHandler } = require("./utils/globalErrorHandler");
const {
  transactionRoutes,
  userRoutes,
  authRoutes,
  categoryRoutes,
  subcategoryRoutes,
} = require("./routes");

const app = express();

app.use(morgan("tiny"));
app.use(express.json({ limit: "10kb" }));

// ROUTES
app.use("/api/transaction", transactionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/subcategory", subcategoryRoutes);

app.use(globalErrorHandler);

module.exports = { app };
