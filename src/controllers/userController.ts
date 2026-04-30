import type { Request, Response } from "express";

import { userService } from "../services/userService.js";
import type { IUser } from "../types/User.js";

type UserService = typeof userService;

const buildUserController = (service: UserService) => ({
  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const createdUser = await service.create(req.body as IUser);
      return res.status(201).json(createdUser);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao criar usuario.",
        error
      });
    }
  },

  async getAllUsers(_req: Request, res: Response): Promise<Response> {
    try {
      const users = await service.listAll();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao listar usuarios.",
        error
      });
    }
  },

  async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params as { id?: string };

      if (!id) {
        return res.status(404).json({ message: "Usuario nao encontrado." });
      }

      const user = await service.listById(id);

      if (!user) {
        return res.status(404).json({ message: "Usuario nao encontrado." });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao buscar usuario.",
        error
      });
    }
  },

  async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params as { id?: string };

      if (!id) {
        return res.status(404).json({ message: "Usuario nao encontrado." });
      }

      const updatedUser = await service.update(id, req.body as Partial<IUser>);

      if (!updatedUser) {
        return res.status(404).json({ message: "Usuario nao encontrado." });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao atualizar usuario.",
        error
      });
    }
  },

  async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params as { id?: string };

      if (!id) {
        return res.status(404).json({ message: "Usuario nao encontrado." });
      }

      const deletedUser = await service.delete(id);

      if (!deletedUser) {
        return res.status(404).json({ message: "Usuario nao encontrado." });
      }

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao excluir usuario.",
        error
      });
    }
  }
});

export const userController = buildUserController(userService);
