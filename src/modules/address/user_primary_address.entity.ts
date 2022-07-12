import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { AddressEntity } from "./address.entity";


@Entity('user-primary-address')
export class UserPrimaryAddressEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => AddressEntity, address => address.user_primary_address) 
    @JoinColumn()
    address: AddressEntity;

    @OneToOne(() => UserEntity, user => user.user_primary_address) 
    @JoinColumn()
    user: UserEntity;
}