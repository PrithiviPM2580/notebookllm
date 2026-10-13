import jwt from "jsonwebtoken";

export const jwtPayload = (userId: string) => {
  const payload = {
    iss: "notebookllm",
    sub: userId,
    aud: "notebookllm",
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1),
  };
  return payload;
};

export const signAccessToken = (userId: string) => {
  const payload = jwtPayload(userId);
  const token = jwt.sign(
    payload,
    process.env.JWT_ACCESS_TOKEN_SECRET as string,
  );
  return token;
};

export const signRefreshToken = (userId: string) => {
  const payload = jwtPayload(userId);
  const token = jwt.sign(
    payload,
    process.env.JWT_REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "7d",
    },
  );
  return token;
};

export const verifyAccessToken = (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET as string,
    );
    return decoded;
  } catch (error) {
    console.error("Error verifying access token:", error);
    return null;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_TOKEN_SECRET as string,
    );
    return decoded;
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    return null;
  }
};
