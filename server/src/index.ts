import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { connectToDatabase } from "./db/connection";
import { createUser } from "./services/user.service";
import driveRouter from "./routes/drive.route";

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 5000;

const sessionOptions = {
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
};

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sessionOptions.cookie.secure = true; // serve secure cookies
}

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await createUser(profile, { accessToken, refreshToken });
      return done(null, user);
    },
  ),
);

passport.serializeUser(function (user, done) {
  console.log("Serializing user:", user);
  done(null, user);
});

passport.deserializeUser(function (obj: any, done) {
  try {
    console.log("Deserializing user:", obj);
    done(null, obj);
  } catch (error) {
    done(error);
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/drive.file",
    ],
    accessType: "offline",
    prompt: "consent",
  }),
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/login",
    successRedirect: process.env.CLIENT_URL,
  }),
);

app.get("/auth/me", (req: any, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  res.json(req.user);
});

app.use(driveRouter);

const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running in https://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();
