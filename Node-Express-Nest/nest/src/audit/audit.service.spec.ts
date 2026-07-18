import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { UserService } from '../user/user.service';

describe('AuditService', () => {
    let auditService: AuditService;

    // Creates a fake version of UserService tracking its internal functions
    const mockUserService = {
        findUser: jest.fn(),
    };

    beforeEach(async () => {
        // Initialises a module with a mini, isolated DI container just for this test
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                // NestJS instantiates the real AuditService inside this container
                AuditService,

                // Intercepts the DI container's instantiation process
                {
                    // The Token: What AuditService looks for in its constructor
                    provide: UserService,
                    // The Override: Swaps the real class instantiation with the pre-made mock object
                    useValue: mockUserService,
                },
            ],
        }).compile();

        auditService = module.get<AuditService>(AuditService);

        // Clears call histories (like how many times findUser was called) before each test
        jest.clearAllMocks();
    });

    describe('runAuditUser', () => {
        it('should return audit message with user name', () => {
            // Tells the mock function exactly what to return when executed
            mockUserService.findUser.mockReturnValue({
                id: 1,
                name: 'Luis',
            });

            const result = auditService.runAuditUser(1);

            expect(mockUserService.findUser).toHaveBeenCalledWith(1);
            expect(result).toBe('Audit completed for Luis');
        });
    });
});
