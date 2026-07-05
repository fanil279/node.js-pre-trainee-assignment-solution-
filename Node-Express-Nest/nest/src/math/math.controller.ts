import { Controller, UseGuards, UseInterceptors, UsePipes, Get, Query } from '@nestjs/common';
import { MathValidationGuard } from './guards/math-validation.guard';
import { QueryTransformerInterceptor } from './interceptors/query-transformer.interceptor';
import { QueryValidationPipe } from './pipes/query-validation.pipe';
import { MathService } from './math.service';
import { LoggerService } from '../logger/logger.service';

@Controller('math')
@UseGuards(MathValidationGuard)
@UseInterceptors(QueryTransformerInterceptor)
@UsePipes(QueryValidationPipe)
export class MathController {
    constructor(
        private readonly mathService: MathService,
        private readonly logger: LoggerService,
    ) {}

    @Get('add')
    add(@Query('num1') num1: number, @Query('num2') num2: number): object {
        this.logger.log('Request reached "math/add" controller');

        return this.mathService.add(num1, num2);
    }
}
