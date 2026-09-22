import { app } from "./src/app.js";
import { PORT } from "./src/env.js";

app.listen(PORT, () => {
  console.log(`Vink Holdings API listening on port ${PORT}`);
});
