import User from "@/models/user.model";
import type { GoogleUser, Token } from "@/types/index.type";

export const createUser = async (googleUser: GoogleUser, token: Token) => {
  try {
    const { sub: id, name, picture, email } = googleUser._json;

    const user = new User({
      name,
      email,
      image: picture,
      googleId: id,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    });

    const newUser = await user.save();
  } catch (error) {
    console.error("Error creating user:", error);
  }
};
