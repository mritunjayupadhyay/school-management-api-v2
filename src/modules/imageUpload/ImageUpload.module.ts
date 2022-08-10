import { ImageUploadController } from './ImageUpload.controller';
import { Module } from "@nestjs/common";
import { ImageUploadService } from './ImageUpload.service';

@Module({
    controllers: [ImageUploadController],
    providers: [ImageUploadService]
})
export class ImageUploadModule {}