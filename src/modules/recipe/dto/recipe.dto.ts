import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { IngredientBasicResponseDto } from "./ingredient.dto";

export class GetRecipeDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'Kheer'
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
    @Type(() => IngredientBasicResponseDto)
    ingredients: IngredientBasicResponseDto[];
}