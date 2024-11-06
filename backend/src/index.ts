import { App } from "./app";
import { prisma } from "./database/db";
import { UserRepository } from "./repositories/user-repository";
import { AuthController } from "./controllers/auth-controller";
import { AuthRoute } from "./routes/auth-route";
import { CafeRepository } from "./repositories/cafe-repository";
import { CafeController } from "./controllers/cafe-controller";
import { CafeRoute } from "./routes/cafe-route";

const PORT = Bun.env.PORT!;

const userRepository = new UserRepository(prisma);
const cafeRepository = new CafeRepository(prisma);

const authController = new AuthController(userRepository);
const cafeController = new CafeController(cafeRepository);

const authRoute = new AuthRoute(authController);
const cafeRoute = new CafeRoute(cafeController);

const app = new App(authRoute, cafeRoute);

app.start(PORT);
