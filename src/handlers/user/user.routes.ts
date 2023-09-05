import { Router } from "express";
import { userProfile } from "../../utils/helper";

const router = Router();

router.get("/profile", userProfile);

export default router;
