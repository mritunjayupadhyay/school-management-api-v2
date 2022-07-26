import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiHeader, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "src/decorators/current_user.decorator";
import { RecipeAdminGuard } from "src/guards/recipeAdmin.guard";
import { transformEntity } from "src/interceptors/transform.interceptor";
import { CreateIngredientDto, UpdateIngredientDto } from "./dto/create.ingredient.dto";
import { CreateRecipeDto, UpdateRecipeDto } from "./dto/create.recipe.dto";
import { GetIngredientDto, IngredientBasicResponseDto } from "./dto/ingredient.dto";
import { GetRecipeByNameDto, GetRecipeDto, RecipeBasicResponseDto, RecipeListBasicResponseDto } from "./dto/recipe.dto";
import { RecipeService } from "./recipe.service";

@ApiTags('Recipe')
@Controller('recipe')
export class RecipeController {
    constructor(
        private readonly recipeService: RecipeService
    ) {}

    @Get('/')
    @transformEntity(RecipeListBasicResponseDto)
    async getRecipes() {
        const { error, data, message, status} = await this.recipeService.getRecipes();
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error, data };
    }

    @ApiHeader({
        name:'token',
        description: 'Authentication header',
    })
    @Post('/')
    @UseGuards(RecipeAdminGuard)
    @transformEntity(RecipeListBasicResponseDto)
    async createRecipe(
        @Body() createRecipeDto: CreateRecipeDto
    ) {
        const { error, data, message, status} = await this.recipeService.createRecipe(createRecipeDto);
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error: false, data };
    }

    @Get('/:recipeId/ingredients/:ingredientId')
    @transformEntity(IngredientBasicResponseDto)
    async getOneIngredient(
        @Param() getIngredientDto: GetIngredientDto
    ) {
        const { error, data, message, status} = await this.recipeService.getOneIngredient(getIngredientDto);
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error, data };
    }

    // Check me
    @ApiHeader({
        name:'token',
        description: 'Authentication header',
    })
    @Put('/:recipeId/ingredients/:ingredientId')
    @UseGuards(RecipeAdminGuard)
    @transformEntity(IngredientBasicResponseDto)
    async updateRecipeIngredient(
        @Param() getIngredientDto: GetIngredientDto,
        @Body() updateIngredientDto: UpdateIngredientDto
    ) {
        const { error, data, message, status} = await this.recipeService.updateRecipeIngredient(getIngredientDto, updateIngredientDto);
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error, data };
    }

    @ApiHeader({
        name:'token',
        description: 'Authentication header',
    })
    @UseGuards(RecipeAdminGuard)
    @Delete('/:recipeId/ingredients/:ingredientId')
    async deleteRecipeIngredient(
        @Param() getIngredientDto: GetIngredientDto,
    ) {
        return this.recipeService.deleteRecipeIngredient(getIngredientDto);
    }

    @Get('/:recipeId/ingredients')
    @transformEntity(IngredientBasicResponseDto)
    async getRecipeIngredients(
        @Param() getRecipeDto: GetRecipeDto
    ) {  // Not so useful as we already get ingredient when we get recipe.
        const { recipeId } = getRecipeDto;
        const { error, data, message, status} = await this.recipeService.getRecipeIngredients(recipeId);
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error, data };
    }

    @ApiHeader({
        name:'token',
        description: 'Authentication header',
    })
    @UseGuards(RecipeAdminGuard)
    @transformEntity(IngredientBasicResponseDto)
    @Post('/:recipeId/ingredients')
    // @UseGuards(RecipeAdminGuard)
    async createRecipeIngredient(
        @Param() getRecipeDto: GetRecipeDto,
        @Body() createIngredientDto: CreateIngredientDto
    ) {
        const { recipeId } = getRecipeDto;
        const { error, data, message, status} = await this.recipeService.createRecipeIngredient(recipeId, createIngredientDto);
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error: false, data };
    }
    

    @Get('get-by-name/:recipeName')
    @transformEntity(RecipeBasicResponseDto)
    async getRecipeByName(
        @Param() getRecipeDto: GetRecipeByNameDto
    ) {
        const { recipeName } = getRecipeDto;
        const { error, data, message, status} = await this.recipeService.getRecipeByName(recipeName);
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error, data };
    }

    @Get('/:recipeId')
    @transformEntity(RecipeBasicResponseDto)
    async getRecipe(
        @Param() getRecipeDto: GetRecipeDto
    ) {
        const { recipeId } = getRecipeDto;
        const { error, data, message, status} = await this.recipeService.getRecipe(recipeId);
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error, data };
    }

    @ApiHeader({
        name:'token',
        description: 'Authentication header',
    })
    @Put('/:recipeId')
    @UseGuards(RecipeAdminGuard)
    @transformEntity(RecipeBasicResponseDto)
    async updateRecipe(
        @Param() getRecipeDto: GetRecipeDto,
        @Body() updateRecipeDto: UpdateRecipeDto
    ) {
        const { recipeId } = getRecipeDto;
        const { error, data, message, status} = await this.recipeService.updateRecipe(recipeId, updateRecipeDto);
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error, data };
    }

    @ApiHeader({
        name:'token',
        description: 'Authentication header',
    })
    @Delete('/:recipeId')
    @UseGuards(RecipeAdminGuard)
    async deleteRecipe(
        @Param() getRecipeDto: GetRecipeDto
    ) {
        const { recipeId } = getRecipeDto;
        return this.recipeService.deleteRecipe(recipeId);
    }
}