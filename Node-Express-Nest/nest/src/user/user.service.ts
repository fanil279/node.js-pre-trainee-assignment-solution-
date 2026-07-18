import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
    constructor(private readonly logger: LoggerService) {}

    findUser(id: number): UserResponseDto {
        this.logger.log('Fetching all users');

        return {
            id: id,
            name: 'Luis',
        };
    }
}
