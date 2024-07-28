import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("Connected to Database");
  } catch (error) {
    console.log(error.message);
  }
};

export default connect;
