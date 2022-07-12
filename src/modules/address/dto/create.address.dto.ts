import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAddressDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        type: String,
    })
    email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'Home'
    })
    label: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'Mr. Upadhyay'
    })
    ownerName: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: '95 B, Martinpara'
    })
    addressLine1: string;

    @IsString()
    @ApiPropertyOptional({
        type: String,
        default: ''
    })
    addressLine2: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'Tiljala'
    })
    policeStation: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'Kolkata'
    })
    district: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'West Bengal'
    })
    state: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'India'
    })
    country: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: '700100'
    })
    pinCode: string;
}