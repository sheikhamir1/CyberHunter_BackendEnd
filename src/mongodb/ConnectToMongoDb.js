const mongoose = require("mongoose");

const mongoDbConnect = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      // `${process.env.MONGODB_URL}`
      `${process.env.MONGODB_URL}/cyberhunter`
    );
    console.log(`MongoDB connected on ${connectionInstance.connection.host}`);
    // console.log(`MongoDB connected on ${connectionInstance}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = mongoDbConnect;
