import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();

// console.log(process.env.MONGO_URI);


const connectDB = () => new Promise(async (resolve, reject) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      // useCreateIndex: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    resolve();
  } catch (err) {
    console.error(`Error: ${err.message}`);
    reject();
    process.exit(1);
  }
});

export default connectDB;
