import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MathModule } from './math/math.module';
import { LoggerModule } from './logger/logger.module';
import { AuditModule } from './audit/audit.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [MathModule, LoggerModule, AuditModule, UserModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
