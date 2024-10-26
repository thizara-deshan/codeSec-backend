import express from "express";
import {
  addFavoriteRecipe,
  fetchRecipesByCategory,
  getFavoriteRecipes,
} from "../controllers/recipeController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Route to get recipes filtered by category
router.get("/category/:category", fetchRecipesByCategory);
router.post("/favorite/:id", protect, addFavoriteRecipe);
router.get("/favorites", protect, getFavoriteRecipes);

export default router;
