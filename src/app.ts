import "dotenv/config";
import express from "express";
import postsRouter from "./routes/posts.js";

const app = express();

app.use(express.json());

// Temporary authentication
app.use((req, _res, next) => {
  req.user = {
    id: 1,
  };

  next();
});

app.use("/posts", postsRouter);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});