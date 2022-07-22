import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiHeader, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "src/decorators/current_user.decorator";
import { RecipeAdminGuard } from "src/guards/recipeAdmin.guard";
import { transformEntity } from "src/interceptors/transform.interceptor";
import { CreateIngredientDto, UpdateIngredientDto } from "./dto/create.ingredient.dto";
import { CreateRecipeDto, UpdateRecipeDto } from "./dto/create.recipe.dto";
import { GetIngredientDto, IngredientBasicResponseDto } from "./dto/ingredient.dto";
import { GetRecipeDto, RecipeBasicResponseDto, RecipeListBasicResponseDto } from "./dto/recipe.dto";
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

    @Get('/:recipeName/ingredients/:ingredientName')
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

    @Put('/:recipeName/ingredients/:ingredientName')
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

    @UseGuards(RecipeAdminGuard)
    @Delete('/:recipeName/ingredients/:ingredientName')
    async deleteRecipeIngredient(
        @Query() getIngredientDto: GetIngredientDto,
    ) {
        return this.recipeService.deleteRecipeIngredient(getIngredientDto);
    }

    @Get('/:recipeName/ingredients')
    @transformEntity(IngredientBasicResponseDto)
    async getRecipeIngredients(
        @Param() getRecipeDto: GetRecipeDto
    ) {  // Not so useful as we already get ingredient when we get recipe.
        const { recipeName } = getRecipeDto;
        const { error, data, message, status} = await this.recipeService.getRecipeIngredients(recipeName);
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
    @Post('/:recipeName/ingredients')
    // @UseGuards(RecipeAdminGuard)
    async createRecipeIngredient(
        @Param() getRecipeDto: GetRecipeDto,
        @Body() createIngredientDto: CreateIngredientDto
    ) {
        const { recipeName } = getRecipeDto;
        const { error, data, message, status} = await this.recipeService.createRecipeIngredient(recipeName, createIngredientDto);
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error: false, data };
    }

    @Get('/:recipeName')
    @transformEntity(RecipeBasicResponseDto)
    async getRecipe(
        @Param() getRecipeDto: GetRecipeDto
    ) {
        const { recipeName } = getRecipeDto;
        const { error, data, message, status} = await this.recipeService.getRecipe(recipeName);
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error, data };
    }

    @Put('/:recipeName')
    @UseGuards(RecipeAdminGuard)
    @transformEntity(RecipeBasicResponseDto)
    async updateRecipe(
        @Param() getRecipeDto: GetRecipeDto,
        @Body() updateRecipeDto: UpdateRecipeDto
    ) {
        const { recipeName } = getRecipeDto;
        const { error, data, message, status} = await this.recipeService.updateRecipe(recipeName, updateRecipeDto);
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error, data };
    }

    @Delete('/:recipeName')
    @UseGuards(RecipeAdminGuard)
    async deleteRecipe(
        @Param() getRecipeDto: GetRecipeDto
    ) {
        const { recipeName } = getRecipeDto;
        return this.recipeService.deleteRecipe(recipeName);
    }
}