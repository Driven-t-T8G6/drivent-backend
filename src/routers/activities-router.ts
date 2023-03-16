import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { listOfActivies, postActivity } from "@/controllers/activities-controller";

const activityRouter = Router();

activityRouter
  .all("/*", authenticateToken)
  .get("/", listOfActivies)
  .post("/:activityId", postActivity)
//  .delete("/:activityId", deleteActivity)

export { activityRouter };
