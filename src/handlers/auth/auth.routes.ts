import { generateTokens } from "../../utils/jwt";
import {
  comparePassword,
  createUserByEmailAndPassword,
  findUserByEmail,
  findUserById,
} from "../user/user.service";
import { v4 as uuidv4 } from "uuid";
import {
  addRefleshTokenToWhiteList,
  deleteRefreshToken,
  findRefreshTokenById,
  revokeTokens,
} from "./auth.service";
import jwt from "jsonwebtoken";
import { hashTokens } from "../../utils/hashToken";

export async function registerUser(req: any, res: any, next: any) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      res.json({ message: "Email and password not provided" });
      return;
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      res.status(400);
      res.json({ message: "Email already exist" });
      return;
    }

    const user = await createUserByEmailAndPassword({ email, password });
    const jti = uuidv4();
    const { access_token, reflesh_token } = generateTokens(user, jti);
    await addRefleshTokenToWhiteList({
      jti,
      refreshToken: reflesh_token,
      userId: user.id,
    });
    res.json({
      access_token,
      reflesh_token,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: any, res: any, next: any) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    res.json({ message: "Email and password not provided" });
    return;
  }

  const existingUser = await findUserByEmail(email);
  if (!existingUser) {
    res.status(400);
    res.json({ message: "Email not registered!" });
    return;
  }

  const validPassword = await comparePassword(password, existingUser.password);
  if (!validPassword) {
    res.status(400);
    res.json({ message: "Invalid email or password" });
    return;
  }

  const jti = uuidv4();
  const { access_token, reflesh_token } = generateTokens(existingUser, jti);
  await addRefleshTokenToWhiteList({
    jti,
    refreshToken: reflesh_token,
    userId: existingUser.id,
  });
  res.json({
    access_token,
    reflesh_token,
  });
}

interface Payload {
  userId: string;
  jti: string;
  iat: any;
  exp: any;
}

export default async function refreshToken(req: any, res: any, next: any) {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      res.status(400);
      res.json({ message: "Reflesh token not provided" });
      return;
    }
    const payload = jwt.verify(
      refresh_token,
      process.env.JWT_REFRESH_SECRET
    ) as Payload;

    const savedRefreshToken = await findRefreshTokenById(payload.jti);

    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      res.status(400);
      res.json({ message: "Reflesh token is roveked or it is not saved" });
      return;
    }

    const hashedToken = hashTokens(refresh_token);
    if (hashedToken !== savedRefreshToken.hashedToken) {
      res.status(400);
      res.json({ message: "Unauthorized" });
      return;
    }

    const user = await findUserById(payload.userId);
    if (!user) {
      res.status(400);
      res.json({ message: "Unauthorized" });
      return;
    }
    await deleteRefreshToken(savedRefreshToken.id);
    const jti = uuidv4();
    const { access_token, reflesh_token: newRefreshToken } = generateTokens(
      user,
      jti
    );
    await addRefleshTokenToWhiteList({
      jti,
      refreshToken: newRefreshToken,
      userId: user.id,
    });

    res.json({
      access_token,
      newRefreshToken,
    });
  } catch (err: any) {
    res.status(401);
    res.json({ message: "Invalid Tokens" });
    return;
  }
}

export async function revokeToken(req: any, res: any) {
  try {
    const { userId } = req.body;
    await revokeTokens(userId);
    res.json({
      message: `Refresh tokens are revoked for use with id ${userId}`,
    });
  } catch (err) {
    res.status(401);
    res.json({ message: "Error occured, check the user id" });
    return;
  }
}
