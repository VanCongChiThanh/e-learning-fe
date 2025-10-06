// src/features/notification/socket/notificationSocket.ts
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const SOCKET_URL = `${process.env.REACT_APP_API_BASE_URL}/ws-notifications`; 
let stompClient: Client | null = null;

export const notificationSocket = {
  connect: (userId: string, onNewNotification: (notif: any) => void) => {
    // Nếu đã có kết nối, bỏ qua
    if (stompClient && stompClient.connected) {
      console.log("🔁 WebSocket already connected");
      return;
    }

    stompClient = new Client({
      webSocketFactory: () => new SockJS(SOCKET_URL),
      reconnectDelay: 10000, // tự động reconnect sau 10s nếu disconnect
      debug: (msg) => console.log("[STOMP]", msg),
      onConnect: () => {
        console.log("✅ Connected to WebSocket");

        // Lắng nghe queue riêng của user
        stompClient?.subscribe(
          `/user/${userId}/queue/notifications`,
          (message: IMessage) => {
            try {
              const notif = JSON.parse(message.body);
              console.log("📩 New notification:", notif);
              onNewNotification(notif);
            } catch (err) {
              console.error("Failed to parse notification:", err);
            }
          }
        );
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"], frame.body);
      },
      onWebSocketClose: () => {
        console.warn("⚠️ WebSocket disconnected");
      },
    });

    stompClient.activate();
  },

  disconnect: () => {
    if (stompClient) {
      stompClient.deactivate();
      console.log("❌ WebSocket disconnected");
    }
  },
};
