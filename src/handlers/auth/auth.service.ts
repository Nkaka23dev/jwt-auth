import { hashTokens } from "../../utils/hashToken";
import { db } from "../../utils/db";

export function addRefleshTokenToWhiteList({
  jti,
  refreshToken,
  userId,
}: {
  jti: any;
  refreshToken: any;
  userId: any;
}) {
  const refreToken = db.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashTokens(refreshToken),
      userId: userId,
    },
  });
  return refreToken;
}

export function findRefreshTokenById(id: any) {
  return db.refreshToken.findUnique({
    where: {
      id,
    },
  });
}

export function deleteRefreshToken(id: string) {
  return db.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
}

export function revokeTokens(userId: string) {
  return db.refreshToken.updateMany({
    where: {
      userId,
    },
    data: {
      revoked: true,
    },
  });
}
