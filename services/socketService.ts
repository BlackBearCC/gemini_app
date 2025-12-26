
import { io, Socket } from "socket.io-client";
import { Message, RoleId } from "../types";

// 假设后端运行在 localhost:8000，如果是部署环境需修改
const SOCKET_URL = "http://localhost:8000";

class SocketService {
  socket: Socket | null = null;
  
  connect(onMessage: (msg: Message) => void, onTyping: (isTyping: boolean) => void) {
    if (this.socket) return;

    this.socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
    });

    this.socket.on("connect", () => {
      console.log("Connected to MIND_0 Backend");
    });

    this.socket.on("new_message", (msg: Message) => {
      onMessage(msg);
    });

    this.socket.on("director_thinking", (data: { isTyping: boolean }) => {
      onTyping(data.isTyping);
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from MIND_0 Backend");
    });
  }

  sendMessage(text: string, history: Message[]) {
    if (this.socket) {
      // 只发送必要字段以减少载荷
      const simplifiedHistory = history.map(h => ({
        roleId: h.roleId,
        text: h.text
      }));
      
      this.socket.emit("client_message", { 
        text, 
        history: simplifiedHistory 
      });
    }
  }

  sendLike(msg: Message, charName: string, history: Message[]) {
    if (this.socket) {
        const simplifiedHistory = history.map(h => ({
            roleId: h.roleId,
            text: h.text
          }));

        this.socket.emit("client_like", {
            msgId: msg.id,
            roleId: msg.roleId,
            roleName: charName,
            text: msg.text,
            history: simplifiedHistory
        });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
