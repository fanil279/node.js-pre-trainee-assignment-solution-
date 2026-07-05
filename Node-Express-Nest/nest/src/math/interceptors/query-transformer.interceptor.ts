import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class QueryTransformerInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();

        const { num1, num2 } = req.query;

        console.log('[Interceptor] QueryTransformerInterceptor executed');

        if (!num1) {
            req.query.num1 = 0;
        } else if (!num2) {
            req.query.num2 = 0;
        }

        return next.handle();
    }
}
