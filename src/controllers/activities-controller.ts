import { AuthenticatedRequest } from "@/middlewares";
import activityService from "@/services/activities-service";
import { NextFunction, Response } from "express";

export async function listOfActivies(req: AuthenticatedRequest, res: Response, next: NextFunction){
    try {
        const data = await activityService.getActivities()
        console.log(data)
        return res.status(200).send(data)
    } catch (error) {
        console.log(error)
        return res.sendStatus(601)
    }
}