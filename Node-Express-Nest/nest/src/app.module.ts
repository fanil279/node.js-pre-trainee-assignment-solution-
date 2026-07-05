import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MathModule } from './math/math.module';
import { LoggerModule } from './logger/logger.module';

@Module({
    imports: [MathModule, LoggerModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
