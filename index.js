import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routers/userRouter.js";
import adminRoute from "./routers/adminRouter.js"
import connect from "./db/db.js";
import cookieParser from "cookie-parser";
import {dirname, join} from "path"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

dotenv.config();
const port = process.env.PORT || 5000;
connect();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["https://verceltest-client.vercel.app", "http://localhost:3000", "http://localhost:4000"],
  methods: [ "GET", "POST", "PUT", "DELETE" ],
  credentials: true
}));

app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);

app.use("/uploads", express.static(join(__dirname, "uploads")));
app.use("/adminuploads", express.static(join(__dirname, "adminuploads")));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
