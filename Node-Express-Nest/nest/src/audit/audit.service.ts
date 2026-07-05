import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuditService {
    constructor(private readonly userService: UserService) {}

    runAuditUser(id: number): string {
        const user = this.userService.findUser(id);

        return `Audit completed for ${user.name}`;
    }
}
