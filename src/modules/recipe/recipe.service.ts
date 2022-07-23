import { HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { Repository } from "typeorm";
import { CreateIngredientDto, UpdateIngredientDto } from "./dto/create.ingredient.dto";
import { CreateRecipeDto, UpdateRecipeDto } from "./dto/create.recipe.dto";
import { GetIngredientDto } from "./dto/ingredient.dto";
import { IngredientEntity } from "./ingredient.entity";
import { RecipeEntity } from "./recipe.entity";

@Injectable()
export class RecipeService {
    constructor(
        @InjectRepository(RecipeEntity)
        private readonly recipeRepository: Repository<RecipeEntity>,
        @InjectRepository(IngredientEntity)
        private readonly ingredientRepository: Repository<IngredientEntity>,
        private configService: ConfigService
    ) {}

    async getRecipes() 
    : Promise<{error: boolean, message?: string, status?: number, data?: RecipeEntity[]}> {
        const data = await this.recipeRepository.find({ active: true });
        return { error: false, data }
    }

    async validateRecipe(createRecipeDto: CreateRecipeDto)
    : Promise<{error: boolean, message?: string, status?: number, newRecipe?: RecipeEntity}> {
        const { name, recipePic, description } = createRecipeDto;

        // Check if recipe Exist
        const recipeData = await this.getRecipe(name);
        if (recipeData.data) {
            return { 
                error: true, 
                message: `${name} already in use.`,
                status: HttpStatus.CONFLICT
            };
        }
        // create new user
        let newRecipe = new RecipeEntity();
        newRecipe.name = name;
        newRecipe.description = description;
        if (recipePic) {
            newRecipe.recipePic = recipePic;
        }

        const errors = await validate(newRecipe);
        if (errors.length > 0) {
            return { 
                error: true, 
                message: errors.join(""),
                status: HttpStatus.BAD_REQUEST
            };
        } else {
            return {error: false, newRecipe};
        }
    }

    async createRecipe(createRecipeDto: CreateRecipeDto)
    : Promise<{error: boolean, message?: string, status?: number, data?: RecipeEntity}> {
        const validatedRecipe = await this.validateRecipe(createRecipeDto);
        if (validatedRecipe.error === true) {
            return validatedRecipe;
        } else {
            const savedUser = await this.recipeRepository.save(validatedRecipe.newRecipe);
            return {error: false, data: savedUser};
        }
    }

    async getRecipe(recipeName: string) 
    : Promise<{error: boolean, message?: string, status?: number, data?: RecipeEntity}> {
        if (!recipeName) {
            return { error: true, status: HttpStatus.BAD_REQUEST, message: 'Recipe name is not given'};
        }
        const recipe = await this.recipeRepository.findOne({ name: recipeName }, { relations: ["ingredients"]});
        if (recipe) {
            return { error: false, data: recipe };
        }
        return { error: true, status: HttpStatus.NOT_FOUND, message: 'Recipe not found'};
    }

    async updateRecipe(recipeName: string, updateRecipeDto: UpdateRecipeDto) {
        const recipeData = await this.getRecipe(recipeName);
        if (recipeData.error === true) {
            return recipeData;
        }
        const recipe = recipeData.data;
        Object.assign(recipe, updateRecipeDto);
        const updatedRecipe = await this.recipeRepository.save(recipe);
        if (updatedRecipe) {
            return {error: false, data: updatedRecipe};
        }
        return {
            error: true,
            status: HttpStatus.NOT_MODIFIED,
            message: 'Error in user update'
        }
    }

    async deleteRecipe(recipeName: string) 
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        // Check if recipe Exist
        const recipeData = await this.getRecipe(recipeName);
        if (recipeData.error === true) {
            return recipeData;
        }
        const deleteRecipe = await this.recipeRepository.delete({ name: recipeName });
        return { error: false, data: deleteRecipe };
    }

    // Not so useful as we already get ingredient when we get recipe.
    async getRecipeIngredients(recipeName: string) : Promise<{error: boolean, message?: string, status?: number, data?: IngredientEntity[]}> {
        const recipeData = await this.getRecipe(recipeName);
        if (recipeData.error === true) {
            return {
                error: true,
                message: 'Recipe is not found',
                status: HttpStatus.BAD_REQUEST
            };
        } 
        const recipe = recipeData.data;
        const ingredients = await this.ingredientRepository.find({ recipe });
        return { error: false, data: ingredients };
    }

    async validateRecipeIngredient(recipe: RecipeEntity, createIngredientDto: CreateIngredientDto)
    : Promise<{error: boolean, message?: string, status?: number, newRecipeIngredient?: IngredientEntity}> {
        const { name, amount, description } = createIngredientDto;

        // create new ingredient
        let newRecipeIngredient = new IngredientEntity();
        newRecipeIngredient.name = name;
        newRecipeIngredient.amount = amount;
        newRecipeIngredient.recipe = recipe;
        newRecipeIngredient.description = description;

        const errors = await validate(newRecipeIngredient);
        if (errors.length > 0) {
            return { 
                error: true, 
                message: errors.join(""),
                status: HttpStatus.BAD_REQUEST
            };
        } else {
            return {error: false, newRecipeIngredient};
        }
    }

    async createRecipeIngredient(recipeName: string, createIngredientDto: CreateIngredientDto)
    : Promise<{error: boolean, message?: string, status?: number, data?: IngredientEntity}> {
        // Check recipe
        const recipeData = await this.getRecipe(recipeName);
        if (recipeData.error === true) {
            return {
                error: true,
                message: 'Recipe is not found',
                status: HttpStatus.BAD_REQUEST
            };
        } 
        const recipe = recipeData.data;

        // Check ingredient
        const { name } = createIngredientDto;
        const ingredientData = await this.getOneIngredientOfRecipe(name, recipe);
        if (ingredientData.data) {
            return {
                error: true,
                message: 'Ingredient is already in Recipe',
                status: HttpStatus.CONFLICT
            };
        }

        const validatedRecipeIngredient = await this.validateRecipeIngredient(recipe, createIngredientDto);
        if (validatedRecipeIngredient.error === true) {
            return validatedRecipeIngredient;
        } else {
            const savedUser = await this.ingredientRepository.save(validatedRecipeIngredient.newRecipeIngredient);
            return {error: false, data: savedUser};
        }
    }

    async getOneIngredient(getIngredientDto: GetIngredientDto) 
    : Promise<{error: boolean, message?: string, status?: number, data?: IngredientEntity}> {
        const { recipeName, ingredientName } = getIngredientDto;
        console.log("query data for ingredient", getIngredientDto);
        const recipeData = await this.getRecipe(recipeName);
        if (recipeData.error === true) {
            return {
                error: true,
                message: 'Recipe is not found',
                status: HttpStatus.BAD_REQUEST
            };
        } 
        const recipe = recipeData.data;
        const ingredientData = await this.getOneIngredientOfRecipe(ingredientName, recipe);
        console.log("ingredient data", ingredientData);
        if (ingredientData.error === false) {
            return { error: false, data: ingredientData.data };
        }
        return { error: true, status: HttpStatus.NOT_FOUND, message: 'Ingredient not found'};
    }

    async getOneIngredientOfRecipe(ingredientName: string, recipe: RecipeEntity) 
    : Promise<{error: boolean, message?: string, status?: number, data?: IngredientEntity}> {
        const ingredient = await this.ingredientRepository.findOne({ name: ingredientName, recipe });
        if (ingredient) {
            return { error: false, data: ingredient };
        }
        return { error: true, status: HttpStatus.NOT_FOUND, message: 'Ingredient not found'};
    }

    async updateRecipeIngredient(getIngredientDto: GetIngredientDto, updateIngredientDto: UpdateIngredientDto) {
        const ingredientData = await this.getOneIngredient(getIngredientDto);
        if (ingredientData.error === true) {
            return ingredientData;
        }
        const ingredient = ingredientData.data;
        Object.assign(ingredient, updateIngredientDto);
        const updatedRecipe = await this.ingredientRepository.save(ingredient);
        if (updatedRecipe) {
            return {error: false, data: updatedRecipe};
        }
        return {
            error: true,
            status: HttpStatus.NOT_MODIFIED,
            message: 'Error in ingredient update'
        }
    }

    async deleteRecipeIngredient(getIngredientDto: GetIngredientDto) 
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        const ingredientData = await this.getOneIngredient(getIngredientDto);
        if (ingredientData.error === true) {
            return ingredientData;
        }
        const deleteRecipe = await this.ingredientRepository.delete({ id: ingredientData.data.id });
        return { error: false, data: deleteRecipe };
    }
}