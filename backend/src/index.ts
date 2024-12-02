import express from "express";
import { Server as SocketIOServer } from "socket.io";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { logger } from "./middlewares/log";
import { verifyJWT } from "./middlewares/jwt";
import { credentials } from "./middlewares/credentials";
import { corsOptions } from "./config/cors-options";
import { errorHandler } from "./middlewares/error";
import authRoute from "./routes/auth-route";
import cafeRoute from "./routes/cafe-route";
import cartRoute from "./routes/cart-route";
import orderRoute from "./routes/order-route";
import categoryRoute from "./routes/category-route";
import itemRoute from "./routes/item-route";
import summaryRoute from "./routes/summary-route";
import userRoute from "./routes/user-route";

const app = express();
const PORT = Bun.env.PORT!;

// Middlewares
app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Server static file
app.use("/", express.static(path.join(__dirname, "../public")));

// Routes that don't need JWT verification
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/cafes", cafeRoute);

// JWT middleware for routes that need verification
app.use(verifyJWT);

// Route requiring JWT
app.use("/api/v1/carts", cartRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/items", itemRoute);
app.use("/api/v1/summary", summaryRoute);
app.use("/api/v1/users", userRoute);

// Handle 404 for non-existent routes
app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

// Start the server
const expressServer = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export const io = new SocketIOServer(expressServer, {
  cors: {
    origin: "*",
  },
});

// Socket.IO Connection
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
