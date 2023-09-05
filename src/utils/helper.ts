import { findUserById } from "../handlers/user/user.service";

export async function userProfile(req: any, res: any) {
  try {
    const { userId } = req.payload;
    const user = await findUserById(userId);
    delete user.password;
    res.json(user);
  } catch (err) {
    res.status(400);
    res.json({
      message: "Could not find the user",
    });
  }
}
