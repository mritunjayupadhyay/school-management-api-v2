import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../user/user.entity";
import { UserModule } from "../user/user.module";
import { AddressController } from "./address.controller";
import { AddressEntity } from "./address.entity";
import { AddressService } from "./address.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([AddressEntity, UserEntity]),
        UserModule
    ],
    controllers: [AddressController],
    providers: [AddressService]
})
export class AddressModule {}