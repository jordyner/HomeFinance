const express = require("express");
const cors = require("cors");
const app = express();
const port = 8000;

const eventController = require("./controller/transaction");
const userController = require("./controller/user");
const budgetController = require("./controller/budget");
const chartController = require("./controller/chart");
const dashboardController = require("./controller/dashboard");

app.use(express.json()); // podpora pro application/json
app.use(express.urlencoded({ extended: true })); // podpora pro application/x-www-form-urlencoded

app.use(cors());

app.use("/transaction", eventController);
app.use("/user", userController);
app.use("/budget", budgetController);
app.use("/chart", chartController);
app.use("/dashboard", dashboardController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
