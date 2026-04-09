const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

process.env.JWT_SECRET     = 'test_secret';
process.env.JWT_EXPIRES_IN = '8h';

jest.mock('../../src/modules/users/User.model');
const User        = require('../../src/modules/users/User.model');
const authService = require('../../src/modules/auth/auth.service');

describe('Auth Service - Unit Tests', () => {

  afterEach(() => jest.clearAllMocks());

  describe('registerUser', () => {
    it('debe registrar un usuario nuevo y retornar token', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: 'abc123', fullName: 'Isabella Test',
        email: 'isa@test.com', role: 'aspirante'
      });
      const result = await authService.registerUser({
        fullName: 'Isabella Test', email: 'isa@test.com',
        documentId: '123456', password: 'Pass1234!'
      });
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe('isa@test.com');
    });

    it('debe lanzar error si el email ya existe', async () => {
      User.findOne.mockResolvedValue({ email: 'isa@test.com' });
      await expect(authService.registerUser({
        fullName: 'Isabella', email: 'isa@test.com',
        documentId: '123', password: 'Pass1234!'
      })).rejects.toThrow('El email ya está registrado');
    });
  });

  describe('loginUser', () => {
    it('debe retornar token con credenciales válidas', async () => {
      const hash = await bcrypt.hash('Pass1234!', 10);
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          _id: 'abc123', email: 'isa@test.com',
          role: 'aspirante', passwordHash: hash
        })
      });
      const result = await authService.loginUser({ email: 'isa@test.com', password: 'Pass1234!' });
      expect(result).toHaveProperty('token');
    });

    it('debe lanzar error con contraseña incorrecta', async () => {
      const hash = await bcrypt.hash('OtraPass!', 10);
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          _id: 'abc123', email: 'isa@test.com',
          role: 'aspirante', passwordHash: hash
        })
      });
      await expect(authService.loginUser({
        email: 'isa@test.com', password: 'Incorrecta!'
      })).rejects.toThrow('Credenciales inválidas');
    });
  });
});