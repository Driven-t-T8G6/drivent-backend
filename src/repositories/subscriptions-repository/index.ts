import { prisma } from '@/config';
import { Prisma } from '@prisma/client';

async function createSubscription(userId: number, activityId: number) {
  return prisma.subscriptions.create({
    data: {
      userId,
      activityId,
    },
  });
}

async function findSubscriptionByUserId(userId: number, activityId: number) {
  return prisma.subscriptions.findFirst({
    where: {
      userId,
      activityId,
    },
  });
}

async function getAllSubscriptionsFromUser(userId: number) {
  return await prisma.subscriptions.findMany({
    where: {
      userId: userId,
    },
    include: {
      Activiy: {},
    },
  });
}

async function removeUserActivity(userId: number, activityId: number) {
  return await prisma.subscriptions.deleteMany({
    where: {
      userId,
      activityId,
    },
  });
}

const subscriptionsRepository = {
  createSubscription,
  findSubscriptionByUserId,
  getAllSubscriptionsFromUser,
  removeUserActivity,
};

export default subscriptionsRepository;
