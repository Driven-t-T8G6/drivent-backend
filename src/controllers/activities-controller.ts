import { AuthenticatedRequest } from "@/middlewares";
import activityService from "@/services/activities-service";
import { NextFunction, Response } from "express";
import httpStatus from "http-status";

export async function listOfActivies(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const { userId } = req

        const data = await activityService.getActivities(userId)
        return res.status(200).send(data)
    } catch (error) {
        if (error.name === 'UnauthorizedError') return res.sendStatus(httpStatus.UNAUTHORIZED);
        if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND)
        return res.sendStatus(500)
    }
}

export async function postActivity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const { userId } = req
        const activityId = Number(req.params.activityId)

        await activityService.postActivity(userId, activityId)
        return res.sendStatus(201)
    } catch (error) {
        if (error.name === 'UnauthorizedError') return res.sendStatus(httpStatus.UNAUTHORIZED);
        if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND)
        return res.sendStatus(500)
    }
}
