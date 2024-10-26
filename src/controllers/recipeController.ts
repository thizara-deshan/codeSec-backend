import axios from "axios";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { db } from "../lib/db";

interface IGetUserAuthInfoRequest extends Request {
  user?: any; // or any other type
}

const fetchRecipesByCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { category } = req.params;

    // Use the category to fetch meals from ThemealDB
    const { data } = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );
    res.json(data.meals);
  }
);

const addFavoriteRecipe = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { id } = req.params;
    const recipe = await db.recipe.create({
      data: {
        mealId: id,
        userId: req.user.id, // Only for logged-in users
        imageUrl: req.body.strMealThumb,
        title: req.body.strMeal,
      },
    });
    res.json(recipe);
  }
);

const getFavoriteRecipes = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const recipes = await db.recipe.findMany({
      where: { userId: req.user.id },
    });
    res.json(recipes);
  }
);

export { fetchRecipesByCategory, addFavoriteRecipe, getFavoriteRecipes };
