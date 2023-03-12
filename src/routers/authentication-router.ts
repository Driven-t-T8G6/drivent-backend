import { githubAccess, singInPost } from "@/controllers";
import { validateBody } from "@/middlewares";
import { githubSchema, signInSchema } from "@/schemas";
import { Router } from "express";

const authenticationRouter = Router();

authenticationRouter.post("/sign-in", validateBody(signInSchema), singInPost);
authenticationRouter.post("/github/sign-in", validateBody(githubSchema), githubAccess);

export { authenticationRouter };
