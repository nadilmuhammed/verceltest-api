import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routers/userRouter.js";
import connect from "./db/db.js";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config();
const port = process.env.PORT || 5000;
connect();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
