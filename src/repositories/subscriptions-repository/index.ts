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

async function findSubscriptionByUserId(userId: number, activityId: number) {
    return prisma.subscriptions.findFirst({
        where: {
            userId,
            activityId
        }
    })
}

async function removeUserActivity(userId: number, activityId: number) {
    return await prisma.subscriptions.deleteMany({
        where: {
            userId,
            activityId
        }
    })

}

const subscriptionsRepository = {
    createSubscription,
    findSubscriptionByUserId,
    removeUserActivity
};

export default subscriptionsRepository;
