import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { IProcessOutLog, PM2Service } from "./services";

class SocketIO {
  private io: Server | undefined;

  init(httpServer: HttpServer) {
    if (this.io !== undefined) {
      throw new Error("Socket server already defined!");
    }

    this.io = new Server(httpServer);

    PM2Service.onLogOut((procLog: IProcessOutLog) => {
      this.io?.emit(`${procLog.process.name}:out_log`, procLog);
    });
  }
}

export default new SocketIO();
