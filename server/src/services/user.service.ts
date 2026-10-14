import User from "@/models/user.model";
import type { Token } from "@/types/index.type";
import { generateTokens } from "@/utils/jwt.util";
import type { Profile } from "passport";

export const createUser = async (googleUser: Profile, token: Token) => {
  try {
    // const { sub: id, name, picture, email } = googleUser._json;
    const { id, name, photos, emails } = googleUser;

    const existingUser = await User.exists({ email: emails?.[0]?.value });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = new User({
      name,
      email: emails?.[0]?.value,
      image: photos?.[0]?.value,
      googleId: id,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    });

    const newUser = await user.save();

    const { accessToken, refreshToken } = await generateTokens(
      newUser._id.toString(),
    );

    return {
      ...newUser.toObject(),
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error("Error creating user:", error);
  }
};
