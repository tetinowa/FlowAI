import express from "express";
const app = express();

const PORT = 8888;

app.listen(PORT, () => {
  console.log("example app listening on port 8888");
});
