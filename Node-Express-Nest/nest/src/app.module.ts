import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MathModule } from './math/math.module';
import { LoggerModule } from './logger/logger.module';
import { AuditModule } from './audit/audit.module';
import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        MathModule,
        LoggerModule,
        AuditModule,
        UserModule,
        TodoModule,
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'root',
            database: 'traineeship',
            autoLoadEntities: true,
            synchronize: true,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
