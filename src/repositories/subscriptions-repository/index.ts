import { prisma } from "@/config";
import { Prisma } from "@prisma/client";

async function createSubscription(userId: number, activityId: number) {
  return prisma.subscriptions.create({
    data: {
        userId,
        activityId
    }
  });
}

const subscriptionsRepository = {
    createSubscription,
};

export default subscriptionsRepository;
