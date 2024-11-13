import { App } from "./app";
import { prisma } from "./database/db";
import { UserRepository } from "./repositories/user-repository";
import { AuthController } from "./controllers/auth-controller";
import { AuthRoute } from "./routes/auth-route";
import { CafeRepository } from "./repositories/cafe-repository";
import { CafeController } from "./controllers/cafe-controller";
import { CafeRoute } from "./routes/cafe-route";
import { CartRepository } from "./repositories/cart-repository";
import { CartController } from "./controllers/cart-controller";
import { CartRoute } from "./routes/cart-route";
import { OrderRepository } from "./repositories/order-repository";
import { OrderController } from "./controllers/order-controller";
import { OrderRoute } from "./routes/order-route";

const PORT = Bun.env.PORT!;

const userRepository = new UserRepository(prisma);
const cafeRepository = new CafeRepository(prisma);
const cartRepository = new CartRepository(prisma);
const orderRepository = new OrderRepository(prisma);

const authController = new AuthController(userRepository);
const cafeController = new CafeController(cafeRepository);
const cartController = new CartController(cartRepository);
const orderController = new OrderController(orderRepository);

const authRoute = new AuthRoute(authController);
const cafeRoute = new CafeRoute(cafeController);
const cartRoute = new CartRoute(cartController);
const orderRoute = new OrderRoute(orderController);

const app = new App(authRoute, cafeRoute, cartRoute, orderRoute);

app.start(PORT);
