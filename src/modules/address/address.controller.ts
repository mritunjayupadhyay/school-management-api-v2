import { Body, Controller, Get, HttpException, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { transformEntity } from "src/interceptors/transform.interceptor";
import { brotliDecompressSync } from "zlib";
import { AddressService } from "./address.service";
import { AddressDto } from "./dto/address.dto";
import { CreateAddressDto } from "./dto/create.address.dto";
import { GetAddressByEmailDto } from "./dto/get.address.dto";

@ApiTags('Address')
@Controller('address')
export class AddressController {
    constructor(
        private readonly addressService: AddressService
    ) {}
   @Get('/')
   async getUsers(
    @Query() getAddressByEmailDto: GetAddressByEmailDto
   ) {
       const { error, data, message, status} = await this.addressService.getAddress(getAddressByEmailDto);
        if (error === true) {
            throw new HttpException({
                message
            }, status)
        }
        return { error, data };
   }

   @transformEntity(AddressDto)
   @Post('/')
   async createAddress(
    @Body() createAddressDto: CreateAddressDto
   ) {
    const { error, data, message, status} = await this.addressService.createAddress(createAddressDto);
    if (error === true) {
        throw new HttpException({
            message
        }, status)
    }
    return { error, data };
   }

   
   @Get('/:userId/primary-address')
   async getPrimaryAddress() {
       return 'get primary address'
   }
}