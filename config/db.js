const mongoose = require('mongoose');
const config = require('config');
const ProdDbUrl = config.get('mongoProdURI');
const LocalDbUrl = config.get('mongoLocalURI');

const connectDB = async () => {
  try {
    await mongoose.connect(
      (process.env==="production")?ProdDbUrl:LocalDbUrl, {
      // added to avoid bugs
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log('MongoDB is connected!');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
