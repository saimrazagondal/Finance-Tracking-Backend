const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');
const { app } = require('./app');

/**
 * DB Connection to atlas
 */
const DB = process.env.DB_CLOUD_CONNECTION?.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log(`Mongo DB Connected`))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
