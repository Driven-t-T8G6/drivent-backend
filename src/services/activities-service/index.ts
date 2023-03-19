import { BadRequestError, notFoundError, unauthorizedError } from '@/errors';
import activityRepository from '@/repositories/activities-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import subscriptionsRepository from '@/repositories/subscriptions-repository';
import ticketRepository from '@/repositories/ticket-repository';

async function getActivities(userId: number) {
  const enrollmentWithAddress = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollmentWithAddress) throw unauthorizedError();

  const verifyUserTicket = await ticketRepository.findTicketByEnrollmentId(enrollmentWithAddress.id);
  if (!verifyUserTicket) throw unauthorizedError();

  const verifyTicketType = await ticketRepository.findTickeWithTypeById(verifyUserTicket.id);
  if (verifyTicketType.TicketType.isRemote || verifyTicketType.status !== 'PAID') throw unauthorizedError();

  return await activityRepository.getActivities();
}

async function postActivity(userId: number, activityId: number) {
  if (isNaN(activityId) || !Number.isInteger(activityId)) throw BadRequestError();

  const enrollmentWithAddress = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollmentWithAddress) throw unauthorizedError();

  const verifyUserTicket = await ticketRepository.findTicketByEnrollmentId(enrollmentWithAddress.id);
  if (!verifyUserTicket) throw unauthorizedError();

  const verifyTicketType = await ticketRepository.findTickeWithTypeById(verifyUserTicket.id);
  if (verifyTicketType.TicketType.isRemote || verifyTicketType.status !== 'PAID') throw unauthorizedError();

  const activity = await activityRepository.getActivityById(activityId);
  if (!activity) throw notFoundError();
  if (activity.atCapacity) throw unauthorizedError();

  let activityEnd = new Date(activity.endsAt);
  let now = new Date(Date.now());

  if (now > activityEnd) throw unauthorizedError();

  await activityRepository.postUserToActivity(activity.id, activity.subscriptions + 1);

  await subscriptionsRepository.createSubscription(userId, activityId);

  if (activity.subscriptions + 1 === activity.capacity) await activityRepository.activityFull(activityId);
  return;
}

async function deleteActivity(userId: number, activityId: number) {
  if (isNaN(activityId) || !Number.isInteger(activityId)) throw BadRequestError();

  const isUserSubscribed = await subscriptionsRepository.findSubscriptionByUserId(userId, activityId);

  if (!isUserSubscribed) throw notFoundError();

  const findActivity = await activityRepository.getActivityById(activityId);

  await activityRepository.removeOneUserFromActivity(activityId, findActivity.subscriptions - 1);

  await subscriptionsRepository.removeUserActivity(userId, activityId);

  return;
}

const activityService = {
  getActivities,
  postActivity,
  deleteActivity,
};

export default activityService;
