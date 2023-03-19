import { prisma } from '@/config';

async function getActivities(userId: number) {
  return await prisma.activity.findMany({
    include: {
      Subscriptions: {
        where: {
          userId: userId,
        },
      },
    },
    orderBy: {
        id: 'asc',
    },
  });
}

async function getActivityById(id: number) {
  return await prisma.activity.findFirst({
    where: {
      id,
    },
  });
}

async function postUserToActivity(id: number, newValueToCapacity: number) {
  return await prisma.activity.update({
    where: {
      id,
    },
    data: {
      subscriptions: newValueToCapacity,
    },
  });
}

async function activityFull(id: number) {
  return await prisma.activity.update({
    where: {
      id,
    },
    data: {
      atCapacity: true,
    },
  });
}

async function removeOneUserFromActivity(id: number, newValueToSubscriptions: number) {
  return await prisma.activity.update({
    where: {
      id,
    },
    data: {
      subscriptions: newValueToSubscriptions,
    },
  });
}

const activityRepository = {
  getActivities,
  getActivityById,
  postUserToActivity,
  activityFull,
  removeOneUserFromActivity,
};

export default activityRepository;
