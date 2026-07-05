import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class UserService {
    constructor(private readonly logger: LoggerService) {}

    findUser(id: number): { id: number; name: string } {
        this.logger.log('Fetching all users');

        return {
            id: id,
            name: 'Luis',
        };
    }
}
