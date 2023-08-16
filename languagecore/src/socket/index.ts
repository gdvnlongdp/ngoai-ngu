import http from "http";
import { Server } from "socket.io";
import { log } from "../utils/logger";

export const initSock = (serv: http.Server) => {
  const io = new Server(serv);

  io.on("connection", (socket) => {
    log.debug(`a socket connected: ${socket.id}`);

    socket.on("disconnect", () => {
      log.debug(`a socket disconnected:", ${socket.id}`);
    });
  });
};
