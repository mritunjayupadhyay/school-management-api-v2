import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { UserPrimaryAddressEntity } from "./user_primary_address.entity";


@Entity('address')
export class AddressEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    label: string;

    @Column()
    ownerName: string;

    @Column()
    addressLine1: string;

    @Column({ nullable: true })
    addressLine2: string;

    @Column()
    policeStation: string;

    @Column()
    district: string;

    @Column()
    state: string;

    @Column({ default: 'India'})
    country: string;

    @Column()
    pinCode: string;

    @ManyToOne(() => UserEntity, user => user.addresses)
    user: UserEntity;

    @OneToOne(() => UserPrimaryAddressEntity, u_p_address => u_p_address.address)
    user_primary_address: UserPrimaryAddressEntity;
}