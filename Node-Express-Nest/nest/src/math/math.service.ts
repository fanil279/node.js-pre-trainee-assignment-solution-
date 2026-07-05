import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class MathService {
    constructor(private readonly logger: LoggerService) {}

    add(a: number, b: number): object {
        this.logger.log(`Adding ${a} + ${b}`);

        return { sum: a + b };
    }
}
