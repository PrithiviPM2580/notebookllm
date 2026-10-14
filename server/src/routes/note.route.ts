import { createNote } from "@/controllers/note.controller";
import { upload } from "@/middlewares/multer.middleware";
import { Router } from "express";

const noteRouter = Router();

noteRouter.post("/upload-documents", upload.single("doc"), createNote);

export default noteRouter;
