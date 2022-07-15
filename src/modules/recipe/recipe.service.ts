import { HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { Repository } from "typeorm";
import { CreateRecipeDto, UpdateRecipeDto } from "./dto/create.recipe.dto";
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
        const data = await this.recipeRepository.find();
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
                status: HttpStatus.BAD_REQUEST
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

    async deleteRecipe(bookName: string) 
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        // Check if recipe Exist
        const recipeData = await this.getRecipe(bookName);
        if (recipeData.error === true) {
            return recipeData;
        }
        const deleteRecipe = await this.recipeRepository.delete({ name: bookName });
        return { error: false, data: deleteRecipe };
    }

    async getRecipeIngredients() : Promise<{error: boolean, message?: string, status?: number, data?: IngredientEntity[]}> {
        const data = await this.ingredientRepository.find();
        return { error: false, data }
    }
}