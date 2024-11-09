import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/user.routes.js";
import cleanlinessRoute from "./routes/cleanlinessScore.routes.js";
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

try {
  await mongoose.connect(
    "mongodb+srv://nayakswadhin25:1111111q@cluster0.kmfkz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
  console.log("mongodb connected successfully.");
} catch (error) {
  console.log(error);
}

app.get("/health", (req, res) => {
  return res.status(200).json({ message: "health is good" });
});

app.use("/user", userRoute);
app.use("/cleanliness", cleanlinessRoute);

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
