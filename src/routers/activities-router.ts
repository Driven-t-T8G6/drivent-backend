import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { listOfActivies } from "@/controllers/activities-controller";

const activityRouter = Router();

activityRouter
  .all("/*", authenticateToken)
  .get("/", listOfActivies)

export { activityRouter };
