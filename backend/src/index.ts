import express from "express";
import cors from "cors";
import { apiRouter } from "./routes";
import cookieParser from "cookie-parser";

// testing

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use("/api/v1", apiRouter);

app.listen(4000, () => {
  console.log("Server started at 4000");
});
