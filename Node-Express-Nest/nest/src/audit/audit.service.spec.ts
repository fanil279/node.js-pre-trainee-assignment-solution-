import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { UserService } from '../user/user.service';

describe('AuditService', () => {
    let auditService: AuditService;

    const mockUserService = {
        findUser: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuditService,
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
            ],
        }).compile();

        auditService = module.get<AuditService>(AuditService);

        jest.clearAllMocks();
    });

    describe('runAuditUser', () => {
        it('should return audit message with user name', () => {
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
