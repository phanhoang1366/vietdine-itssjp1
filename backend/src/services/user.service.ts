import 'server-only';
import prisma from '../db/prisma';
import type { RoleId } from '../lib/definitions';
import { User } from '@prisma/client';

// ─── Helper: strip password from user ─────────────────────────
export function toSafeUser(user: User) {
  const { passwordHash, ...safeUser } = user;
  return {
    id: safeUser.id,
    name: safeUser.fullName,
    email: safeUser.emailPhone,
    phone: safeUser.emailPhone, // Currently emailPhone stores email. For phone, we might need to adjust logic, but sticking to existing for now.
    roleId: safeUser.roleId as RoleId,
    avatarUrl: safeUser.avatarUrl,
  };
}

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { emailPhone: email },
  });
}

export async function findUserById(id: number) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export async function createUser(data: {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  roleId: RoleId;
  restaurantName?: string;
}) {
  return await prisma.$transaction(async (tx: any) => {
    // 1. Ensure Roles exist (Auto-seed if necessary)
    const role = await tx.role.upsert({
      where: { id: data.roleId },
      update: {},
      create: {
        id: data.roleId,
        name: data.roleId === 1 ? 'Customer' : data.roleId === 2 ? 'Owner' : 'Guest',
      },
    });

    // 2. Create User
    const user = await tx.user.create({
      data: {
        fullName: data.name,
        emailPhone: data.email, // Using email as the primary unique identifier
        passwordHash: data.passwordHash,
        roleId: role.id,
      },
    });

    // 3. Create Restaurant if Owner
    if (data.roleId === 2 && data.restaurantName) {
      await tx.restaurant.create({
        data: {
          ownerId: user.id,
          name: data.restaurantName,
          address: 'Chưa cập nhật', // Default address
        },
      });
    }

    return user;
  });
}

export async function updateUser(
  id: number,
  data: { name?: string; phone?: string }
) {
  return await prisma.user.update({
    where: { id },
    data: {
      fullName: data.name,
      // If we wanted to update phone, we'd update emailPhone or add a phone column.
      // Keeping it simple based on existing schema.
    },
  });
}

export async function updatePassword(id: number, passwordHash: string) {
  return await prisma.user.update({
    where: { id },
    data: { passwordHash },
  });
}
