import { HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as AWS from "aws-sdk";
import { GetSignedUrlDto } from "./dto/getSignedUrl.dto";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ImageUploadService {
    // s3: AWS.S3;
    constructor(
        private configService: ConfigService,
    ) {
        // this.s3 = new AWS.S3({
        //     accessKeyId: this.configService.get("AWS_S3_ACCESS_KEY"),
        //     secretAccessKey: this.configService.get("AWS_S3_SECRET_KEY")
        // })
    }
    async getSignedUrl(getSignedUrlDto: GetSignedUrlDto)
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        const s3Obj = new AWS.S3({
            accessKeyId: this.configService.get("AWS_S3_ACCESS_KEY"),
            secretAccessKey: this.configService.get("AWS_S3_SECRET_KEY")
        })
        // return {
        //     accessKeyId: this.configService.get("AWS_S3_ACCESS_KEY"),
        //     secretAccessKey: this.configService.get("AWS_S3_SECRET_KEY")
        // }
        const uuidKey = uuidv4();
        const key = `${getSignedUrlDto.key}_${uuidKey}`;
        try {
            const signedUrl = await s3Obj.getSignedUrlPromise('putObject', {
                Bucket: getSignedUrlDto.bucket,
                Key: key,
                ContentType: getSignedUrlDto.contentType
            });
            if (signedUrl) {
                return {
                    error: false,
                    data: signedUrl
                }
            }
            return {
                error: true,
                status: HttpStatus.EXPECTATION_FAILED,
                message: 'Error in getting Signed Url'
            };
        } catch(err) {
            return {
                error: true,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: err
            };
        }
    }
}