import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class MathValidationGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();

        const { num1, num2 } = req.query;

        console.log('[Guard] MathValidationGuard executed');

        if (!num1 && !num2) {
            return false;
        }

        return true;
    }
}
