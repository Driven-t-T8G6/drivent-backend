import { AuthenticatedRequest } from '@/middlewares';
import activityService from '@/services/activities-service';
import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';

export async function listOfActivies(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;

    const data = await activityService.getActivities(userId);
    return res.status(200).send(data);
  } catch (error) {
    if (error.name === 'UnauthorizedError') return res.sendStatus(httpStatus.UNAUTHORIZED);
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    return res.sendStatus(500);
  }
}

export async function postActivity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const activityId = Number(req.params.activityId);
    console.log(userId);

    await activityService.postActivity(userId, activityId);
    return res.sendStatus(201);
  } catch (error) {
    if (error.name === 'UnauthorizedError') return res.sendStatus(httpStatus.UNAUTHORIZED);
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === 'BadRequestError') return res.sendStatus(httpStatus.BAD_REQUEST);
    if (error.name === 'ConflictError') return res.sendStatus(httpStatus.CONFLICT);
    return res.sendStatus(500);
  }
}

export async function deleteActivity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const activityId = Number(req.params.activityId);

    await activityService.deleteActivity(userId, activityId);
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    if (error.name === 'UnauthorizedError') return res.sendStatus(httpStatus.UNAUTHORIZED);
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === 'BadRequestError') return res.sendStatus(httpStatus.BAD_REQUEST);

    return res.sendStatus(500);
  }
}
