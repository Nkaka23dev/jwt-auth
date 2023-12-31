import express from "express";
import refreshToken, {
  login,
  registerUser,
  revokeToken,
} from "./handlers/auth/auth.routes";
import router from "./handlers/user/user.routes";
import protect from "./middleware";

export const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  // console.log(req);
  res.json({ response: "Server is up and running" });
});

app.use("/api", protect, router);

app.post("/register", registerUser);
app.post("/login", login);
app.post("/refresh", refreshToken);
app.post("/revoke_tokens", revokeToken);
