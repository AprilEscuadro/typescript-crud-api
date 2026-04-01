// src/users/user.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config.json';
import { db } from '../_helpers/db';
import { Role } from '../_helpers/role';
import { User, UserCreationAttributes } from './user.model';

export const userService = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  verify,
  delete: _delete
};

async function getAll(): Promise<User[]> {
    return await db.User.findAll();
}

async function getById(id: number): Promise<User> {
    return await getUser(id);
}

async function create(params: UserCreationAttributes & { password: string }): Promise<void> {
    // Check if email already exists
    const existingUser = await db.User.findOne({ where: { email: params.email } });
    if (existingUser) {
        throw new Error(`Email "${params.email}" is already registered`);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(params.password, 10);

    // Create user (exclude password from saved fields)
    await db.User.create({
        ...params,
        passwordHash,
        role: params.role || Role.User, // Default to User role
        verified: false
    } as UserCreationAttributes);
}

async function update(
  id: number,
  params: Partial<UserCreationAttributes> & { password?: string }
): Promise<void> {
  const user = await getUser(id);

  if (params.password) {
    params.passwordHash = await bcrypt.hash(params.password, 10);
    delete params.password;
  }

  await user.update(params as Partial<UserCreationAttributes>);
}

async function _delete(id: number): Promise<void> {
    const user = await getUser(id);
    await user.destroy();
}

// Helper: Get user or throw error
async function getUser(id: number): Promise<User> {
    const user = await db.User.scope('withHash').findByPk(id);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

async function authenticate(email: string, password: string): Promise<object> {
  const user = await db.User.scope('withHash').findOne({ where: { email } });
  
  if (!user) throw new Error('Email or password is incorrect');
  
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new Error('Email or password is incorrect');

  if (!user.verified) throw new Error('Your account is not verified yet. Please wait for admin approval.');

  const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: '7d' });
  
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    token
  };
}

async function verify(id: number): Promise<void> {
  const user = await getUser(id);
  await user.update({ verified: true });
}