import jwt from "jsonwebtoken";

export default function protect(req: any, res: any, next: any) {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.json({ message: "Unauthorized!" });
    return;
  }

  const [_, token] = bearer.split(" ");

  if (!token) {
    res.status(400);
    res.json({ message: "Unauthorized!" });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.payload = payload;
    next();
  } catch (err) {
    res.status(400);
    res.json({ message: "Unauthorized!" });
    return;
  }
}
