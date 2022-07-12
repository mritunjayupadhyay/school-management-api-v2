import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { Repository } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { AddressEntity } from "./address.entity";
import { CreateAddressDto } from "./dto/create.address.dto";
import { GetAddressByEmailDto } from "./dto/get.address.dto";

@Injectable()
export class AddressService {
    constructor(
        @InjectRepository(AddressEntity)
        private readonly addressRepository: Repository<AddressEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly userService: UserService
    ) {}
    async getAddress(getAddressByEmailDto: GetAddressByEmailDto) 
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        const { email } = getAddressByEmailDto;
        const userData = await this.userService.getUserByEmail(email);
        if (userData.error === true) {
            return userData;
        } 
        const user = userData.data;
        const addresses = await this.addressRepository.find({ user });
        if (addresses.length) {
            return { error: false, data: addresses };
        }
        return {
            error: true,
            message: 'No addresses found',
            status: HttpStatus.NOT_FOUND
        };
    }
    async createAddress(createAddressDto: CreateAddressDto) 
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        try {
            const { email, addressLine1, addressLine2, ownerName, label, district,
                policeStation, state, country, pinCode } = createAddressDto;
                const userData = await this.userService.getUserByEmail(email);
                if (userData.error === true) {
                    return userData
                } 
                const user = userData.data;
                const newAddress = new AddressEntity();
                newAddress.addressLine1 = addressLine1;
                newAddress.addressLine2 = addressLine2;
                newAddress.label = label;
                newAddress.ownerName = ownerName;
                newAddress.policeStation = policeStation;
                newAddress.district = district;
                newAddress.state = state;
                newAddress.country = country;
                newAddress.pinCode = pinCode;
                newAddress.user = user;
                const errors = await validate(newAddress);
                if (errors.length > 0) {
                    return { 
                        error: true, 
                        message: errors.join(""),
                        status: HttpStatus.BAD_REQUEST
                    };
                } 
                const savedAddress = await this.addressRepository.save(newAddress);
                user.addresses.push(savedAddress);
                await this.userRepository.save(user);
                return {error: false, data: savedAddress};
        } catch(e) {
            return {
                error: true,
                message: 'Error in saving Address',
                status: HttpStatus.INTERNAL_SERVER_ERROR
            }
        }
    }
}