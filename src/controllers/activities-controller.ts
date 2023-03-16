import { AuthenticatedRequest } from "@/middlewares";
import activityService from "@/services/activities-service";
import { NextFunction, Response } from "express";
import httpStatus from "http-status";

export async function listOfActivies(req: AuthenticatedRequest, res: Response, next: NextFunction){
    try {
        const { userId } = req
        const data = await activityService.getActivities(userId)
        console.log(data)
        return res.status(200).send(data)
    } catch (error) {
        if (error.name === 'UnauthorizedError') return res.sendStatus(httpStatus.UNAUTHORIZED);
        return res.sendStatus(500)
    }
}