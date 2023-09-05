import { db } from "../../utils/db";
import bcrypt from "bcrypt";

export const findUserByEmail = (email: string) => {
  const user = db.user.findUnique({
    where: {
      email,
    },
  });
  return user;
};

export const hashPassword = (password: any) => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = (password: any, hash: any) => {
  return bcrypt.compare(password, hash);
};

export const createUserByEmailAndPassword = async (user: any) => {
  user.password = await hashPassword(user.password);
  return db.user.create({
    data: user,
  });
};

export const findUserById = (id: any) => {
  return db.user.findUnique({
    where: {
      id,
    },
  });
};
