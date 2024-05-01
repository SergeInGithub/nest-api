import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let authService: AuthService;
  let authController: AuthController;
  let jwtToken = 'jwtToken';

  const mockAuthService = {
    signup: jest.fn().mockResolvedValueOnce(jwtToken),
    login: jest.fn().mockResolvedValueOnce(jwtToken),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signup', () => {
    it('should register new user', async () => {
      const signupDto = {
        name: 'test user',
        email: 'testing@example.com',
        password: 'Password@123',
      };

      const result = await authController.signup(signupDto);
      expect(authService.signup).toHaveBeenCalled();
      expect(result).toEqual(jwtToken);
    });
  });

  describe('login', () => {
    it('should login the user', async () => {
      const loginDto = {
        email: 'testing@example.com',
        password: 'Password@123',
      };

      const result = await authController.login(loginDto);
      expect(authService.login).toHaveBeenCalled();
      expect(result).toEqual(jwtToken);
    });
  });
});
