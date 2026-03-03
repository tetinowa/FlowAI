import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
const PORT = 8888;

app.listen(PORT, () => {
  console.log("example app listening on port 8888");
});
