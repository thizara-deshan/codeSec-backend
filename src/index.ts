import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import userRoutes from "./routes/userRoutes";
import recipeRoutes from "./routes/recipeRoutes";
import { notFound, errorHandler } from "./middleware/errorMiddleware";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://code-sec-frontend.vercel.app",
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health is Ok!" });
});

app.use(notFound);
app.use(errorHandler);

app.listen(7000, () => {
  console.log("server started on localhost: 7000");
});
