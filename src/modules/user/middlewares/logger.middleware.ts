import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../user.service';
import { UserEntity } from '../user.entity';


@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    console.log("headers we have", req.url);
    next();
  }
  
}
