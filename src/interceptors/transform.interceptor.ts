import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UseInterceptors } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function transformEntity(dto: any) {
  return UseInterceptors(new TransformInterceptor(dto))
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    
    return next.handle().pipe(map(res => {
      // return ({ res });
      let request = context.switchToHttp().getRequest();
      if (request.body) {
        console.log("this is the body", request.body);
      }
      if (res.error === false && res.data) {
        let serializeData: any;
        if (Array.isArray(res.data)) { // if return data is in form of list(array)
          serializeData = res.data.map((item) => {
            // return item;
            return plainToInstance(this.dto, item, {
              excludeExtraneousValues: true
            })
          })
        } else {
          serializeData = plainToInstance(this.dto, res.data, {
            excludeExtraneousValues: true
          })
        }
        res.data = serializeData;
      }
      return res;
    }));
  }
}