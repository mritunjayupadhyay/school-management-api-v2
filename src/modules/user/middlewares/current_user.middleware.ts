import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../user.service';
import { UserEntity } from '../user.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserEntity
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService,
    private readonly userService: UserService
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeaders = req.headers.token;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];
      console.log("token we got in header", token, this.configService.get("JWTPRIVATEKEY"))
      const decoded: any = jwt.verify(token, this.configService.get("JWTPRIVATEKEY"));
      console.log("decoded string", decoded);
      const user = await this.userService.getUserById(decoded.userId);

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
      }

      req.currentUser = user.data;
      next();

    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }
  
}
