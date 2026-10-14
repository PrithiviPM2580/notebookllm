import type { Request, Response } from "express";
import { google } from "googleapis";

export const getDriveFiles = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;

    if (!user?.gooleAccessToken) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const oauth2Client = new google.auth.OAuth2({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
    });

    oauth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken,
    });

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const response = await drive.files.list({
      pageSize: 10,
      fields: "files(id,name,mimeType,webViewLink)",
    });

    res.json(response.data.files);
  } catch (error) {
    console.error("Error fetching Google Drive files:", error);
    res.status(500).json({ message: "Error fetching Google Drive files" });
  }
};
