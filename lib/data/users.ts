'use server';

import { db } from '@/lib/db';
import { User } from '@prisma/client';

export async function getUsers() {
  return db.user.findMany();
}

export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
  });
}

export async function createUser(data: Omit<User, 'id'>) {
  return db.user.create({
    data,
  });
}

export async function updateUser(id: string, data: Partial<User>) {
  return db.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id: string) {
  return db.user.delete({
    where: { id },
  });
}
