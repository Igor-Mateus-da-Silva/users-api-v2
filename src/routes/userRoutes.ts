import { Router } from "express";

import { userController } from "../controllers/userController.js";

const userRoutes = Router();

userRoutes.post("/users", userController.createUser);
userRoutes.get("/users", userController.getAllUsers);
userRoutes.get("/users/:id", userController.getUserById);

export { userRoutes };
