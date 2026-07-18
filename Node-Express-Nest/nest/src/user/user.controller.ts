import { Controller, ParseIntPipe, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { LoggerService } from '../logger/logger.service';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly logger: LoggerService,
    ) {}

    @Get(':id')
    findAll(@Param('id', ParseIntPipe) id: number): UserResponseDto {
        this.logger.log('Request reached "user/users" controller');

        return this.userService.findUser(id);
    }
}
