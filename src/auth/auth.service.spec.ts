import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let model: Model<User>;
  let jwtService: JwtService;
  let token = 'jwtToken';

  const mockUser = {
    _id: '61c0ccf11d7bf83d153d7c06',
    name: 'test user',
    email: 'testing@gmail.com',
  };

  const mockAuthService = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getModelToken(User.name),
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    model = module.get<Model<User>>(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signup', () => {
    const signupDto = {
      name: 'test user',
      email: 'testing@example.com',
      password: 'Password@123',
    };

    it('should register the new user', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockUser as any));

      jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');

      const result = await authService.signup(signupDto);

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(result).toEqual({ token });
    });

    it('should throw duplicate email entered', async () => {
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.reject({ code: 11000 }));

      await expect(authService.signup(signupDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'testing@example.com',
      password: 'Password@123',
    };

    it('should login a user and return the token', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await authService.login(loginDto);

      expect(result).toEqual({ token });
    });

    it('should throw invalid email error', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);

      expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw invalid password error', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
