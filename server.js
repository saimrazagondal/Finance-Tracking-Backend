const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const sequelize = require("./db/client");
const { app } = require("./app");

/**
 * Postgres DB Connection
 */
sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
