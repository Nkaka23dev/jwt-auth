import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

export const createJWT = (user: User): any => {
  const token = jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "5min",
  });
  return token;
};

export const createRefleshToken = (user: User, jti: string): any => {
  const refleshToken = jwt.sign(
    {
      userId: user.id,
      jti,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "8h",
    }
  );
  return refleshToken;
};

export const generateTokens = (user: User, jti: string) => {
  const access_token = createJWT(user);
  const reflesh_token = createRefleshToken(user, jti);
  return {
    access_token,
    reflesh_token,
  };
};
