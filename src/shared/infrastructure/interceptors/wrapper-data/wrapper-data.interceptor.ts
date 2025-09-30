import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { map, Observable } from 'rxjs'

@Injectable()
export class WrapperDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(body => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return !body || 'accessToken' in body || 'meta' in body
          ? body
          : { data: body }
      }),
    )
  }
}
