import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { UserModule } from '../user/user.module';

@Module({
    imports: [UserModule],
    providers: [AuditService],
})
export class AuditModule {}
