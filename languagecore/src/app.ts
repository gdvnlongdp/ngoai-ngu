import express from "express";
import cors from "cors";
import http from "http";
import helmet from "helmet";
import { connect } from "./config/db";
import { initSock } from "./socket";
import { log } from "./utils/logger";
import { PORT, MONGODB_URI } from "./config/index";
import { authRoutes, generalRoutes, managementRoutes } from "./routes";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/general", generalRoutes);
app.use("/api/management", managementRoutes);

const server = http.createServer(app);

/**
 * CUSTOM REQUEST EXPRESS
 */
declare module "express" {
  interface Request {
    user?: any;
  }
}

/**
 * INIT SOCKET
 */
initSock(server);

/**
 * CONNECT TO MONGODB
 */
connect(MONGODB_URI);

server.listen(PORT, () => {
  log.info(`server is running at port ${PORT}`);
});
