import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class QueryValidationPipe implements PipeTransform {
    transform(value: any) {
        console.log('[Pipe] QueryValidationPipe executed');

        const number = Number(value);

        if (Number.isNaN(number)) {
            return 0;
        }

        return number;
    }
}
