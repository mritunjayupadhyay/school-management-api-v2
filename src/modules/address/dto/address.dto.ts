import { Expose } from "class-transformer";

export class AddressDto {
    @Expose()
    label: string;

    @Expose()
    ownerName: string;

    @Expose()
    addressLine1: string;

    @Expose()
    addressLine2: string;

    @Expose()
    policeStation: string;

    @Expose()
    district: string;

    @Expose()
    state: string;

    @Expose()
    country: string;

    @Expose()
    pinCode: string;
}