import { getDriveFiles } from "@/controllers/drive.controller";
import { Router } from "express";

const driveRouter = Router();

driveRouter.get("/user/files", getDriveFiles);

export default driveRouter;
