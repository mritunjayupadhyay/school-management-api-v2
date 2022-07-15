import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiHeader, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "src/decorators/current_user.decorator";
import { RecipeAdminGuard } from "src/guards/recipeAdmin.guard";
import { CreateRecipeDto, UpdateRecipeDto } from "./dto/create.recipe.dto";
import { GetRecipeDto } from "./dto/recipe.dto";
import { RecipeService } from "./recipe.service";

@ApiTags('Recipe')
@Controller('recipe')
export class RecipeController {
    constructor(
        private readonly recipeService: RecipeService
    ) {}

    @Get('/')
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

    @Get('/:recipeName')
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
    async deleteRecipe(
        @Param() getRecipeDto: GetRecipeDto
    ) {
        const { recipeName } = getRecipeDto;
        return this.recipeService.deleteRecipe(recipeName);
    }

    @Get('/:recipeName/ingredients')
    async getRecipeIngredients() {
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
    @Post('/:recipeName/ingredients')
    @UseGuards(RecipeAdminGuard)
    async createRecipeIngredient(
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

    @Get('/:recipeName/ingredients/:ingredient')
    async getRecipeOneIngredient(
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

    @Put('/:recipeName/ingredients/:ingredient')
    async updateRecipeIngredient(
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

    @Delete('/:recipeName/ingredients/:ingredient')
    async deleteRecipeIngredient(
        @Param() getRecipeDto: GetRecipeDto
    ) {
        const { recipeName } = getRecipeDto;
        return this.recipeService.deleteRecipe(recipeName);
    }
}