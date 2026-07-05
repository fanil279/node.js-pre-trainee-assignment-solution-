import { Controller, Get, Query } from '@nestjs/common';
import { MathService } from './math.service';
import { LoggerService } from '../logger/logger.service';

@Controller('math')
export class MathController {
    constructor(
        private readonly mathService: MathService,
        private readonly logger: LoggerService,
    ) {}

    @Get('add')
    add(@Query('num1') num1: string, @Query('num2') num2: string): object {
        this.logger.log('Request reached controller');

        const n1 = Number(num1);
        const n2 = Number(num2);

        return this.mathService.add(n1, n2);
    }
}
