import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { LoggerService } from '../logger/logger.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly logger: LoggerService,
    ) {}

    @Get('users/:id')
    findAll(@Param('id') id: string): { id: number; name: string } {
        this.logger.log('Request reached "user/users" controller');

        const idNum = Number(id);

        return this.userService.findUser(idNum);
    }
}
