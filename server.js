const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

const app = require('./app');

mongoose
  .connect(process.env.DATABASE_LOCAl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected to database successfully');
  })
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App runing on port ${port}`);
});
