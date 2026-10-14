import path from "node:path";
import fs from "node:fs";
import multer from "multer";
import { cwd } from "node:process";
import { loadDocuments } from "@/langchain/note-loader.langchain";

const currentDir = cwd();

const uploadDir = path.join(currentDir, "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

export const upload = multer({ storage: storage });
