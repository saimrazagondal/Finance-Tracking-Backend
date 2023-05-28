const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const sequelize = require('./db/client');
// const mongoose = require('mongoose')
const { app } = require('./app');

/**
 * DB Connection to atlas
 */
// const DB = process.env.DB_CLOUD_CONNECTION?.replace(
//   '<PASSWORD>',
//   process.env.DB_PASSWORD
// )

// mongoose
//   .connect(DB, {
//     useNewUrlParser: true
//   })
//   .then(() => console.log(`Mongo DB Connected`))
//   .catch((err) => console.log(err))

sequelize
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
