import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { IngredientBasicResponseDto } from "./ingredient.dto";

export class GetRecipeDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 2
    })
    readonly recipeId: string;
}


export class GetRecipeByNameDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'kheer'
    })
    readonly recipeName: string;
}

export class RecipeListBasicResponseDto {
    @Expose()
    name: string;
    @Expose()
    description: string;
    @Expose()
    id: number;
    @Expose()
    recipePic: string;
    @Expose()
    nonVeg: string;
}

export class RecipeBasicResponseDto {
    @Expose()
    name: string;
    @Expose()
    description: string;
    @Expose()
    id: number;
    @Expose()
    recipePic: string;
    @Expose()
    nonVeg: string;
    @Expose()
    @Type(() => IngredientBasicResponseDto)
    ingredients: IngredientBasicResponseDto[];
}