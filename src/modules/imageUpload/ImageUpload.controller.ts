import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import * as AWS from 'aws-sdk'
import { GetSignedUrlDto } from "./dto/getSignedUrl.dto";
import { ImageUploadService } from "./ImageUpload.service";

@ApiTags('ImageUpload')
@Controller('image-upload')
export class ImageUploadController {
    constructor(
        private readonly imageUploadService: ImageUploadService
    ) {
       
    }
    @Get('/signed-url')
    async getSignedUrl(
        @Query() getSignedUrlDto: GetSignedUrlDto
    ) {
        const signedUrl = await this.imageUploadService.getSignedUrl(getSignedUrlDto);
        return signedUrl;
    }
}