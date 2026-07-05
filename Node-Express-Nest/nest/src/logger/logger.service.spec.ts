import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
    let service: LoggerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LoggerService],
        }).compile();

        service = module.get<LoggerService>(LoggerService);
    });

    describe('log()', () => {
        it('should log a formatted message', () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            service.log('Hello logger');

            expect(consoleSpy).toHaveBeenCalledWith('[Logger] Hello logger');

            consoleSpy.mockRestore();
        });
    });
});
