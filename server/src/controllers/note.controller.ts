import { create } from "@/services/note.service";
import type { Request, Response } from "express";

export const createNote = async (req: Request, res: Response) => {
  const note = await create({
    name: req.body.name,
    image: req.body.image,
    userId: req.body.userId,
  });

  res.status(201).json(note);
};
