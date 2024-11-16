import express from "express";
import cors from "cors";
import { apiRouter } from "./routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.listen(4000, () => {
  console.log("Server started at 4000");
});
