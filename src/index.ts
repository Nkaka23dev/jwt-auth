import { app } from "./app";
import * as dotenv from "dotenv";

dotenv.config();

const PORT = 4200;

app.listen(PORT, () => {
  console.log(`Server is running on PORT:http://localhost:${PORT}`);
});
