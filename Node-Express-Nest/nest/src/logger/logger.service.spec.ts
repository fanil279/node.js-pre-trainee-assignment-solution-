import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
    let service: LoggerService;

    beforeEach(async () => {
        // Creates an isolated NestJS module runtime environment with DI
        const module: TestingModule = await Test.createTestingModule({
            providers: [LoggerService], // Injects the service that is being tested
        }).compile();

        // Retrieves the active instance of the service from the fake module
        service = module.get<LoggerService>(LoggerService);
    });

    describe('log()', () => {
        it('should log a formatted message', () => {
            // Intercepts and silences console.log so we can track its usage
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            service.log('Hello logger');

            expect(consoleSpy).toHaveBeenCalledWith('[Logger] Hello logger');

            // Restores the original console.log behavior for other tests
            consoleSpy.mockRestore();
        });
    });
});
