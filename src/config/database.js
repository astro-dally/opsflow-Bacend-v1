import mongoose from "mongoose"
import config from "./config.js"
import logger from "../utils/logger.js"

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false)
    const conn = await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    logger.info(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
