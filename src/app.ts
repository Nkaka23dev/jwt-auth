import express from "express";
import refreshToken, {
  login,
  registerUser,
  revokeToken,
} from "./handlers/auth/auth.routes";

export const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  // console.log(req);
  res.json({ response: "Server is up and running" });
});

app.post("/register", registerUser);
app.post("/login", login);
app.post("/refresh", refreshToken);
app.post("/revoke_tokens", revokeToken);
