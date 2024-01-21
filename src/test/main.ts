import { EnvProvider, runApp } from "../public-api.js";
import { AppModule } from "./app.module.js";
import { zEnv } from "./env.z.js";

// Parse environment variables
EnvProvider.parse(zEnv);

// Run application
runApp(AppModule);
