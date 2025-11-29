import { Client, IMessage } from "@stomp/stompjs";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

// http://localhost:8105  → ws://localhost:8105
// https://domain.com      → wss://domain.com
const SOCKET_URL = BASE_URL.replace(/^http/, "ws") + "/ws-notifications";

let stompClient: Client | null = null;

export const notificationSocket = {
  connect: (userId: string, onNewNotification: (notif: any) => void) => {
    const token = localStorage.getItem("token");

    if (stompClient?.active) return;

    stompClient = new Client({
      brokerURL: SOCKET_URL, // WebSocket thuần, không SockJS
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (msg) => console.log("[STOMP DEBUG]", msg),

      connectHeaders: {
        Authorization: token ? `Bearer ${token}` : "",
      },

      onConnect: () => {
        const topic = `/user/${userId}/queue/notifications`;
        stompClient?.subscribe(topic, (message: IMessage) => {
          try {
            const notif = JSON.parse(message.body);
            onNewNotification(notif);
          } catch {}
        });
      },

      onWebSocketClose: (evt) => console.warn("⚠️ WebSocket closed:", evt),
      onStompError: (frame) => console.warn("⚠️ STOMP ERROR:", frame),
    });

    stompClient.activate();
  },

  disconnect: () => {
    if (stompClient?.active) stompClient.deactivate();
    stompClient = null;
  },

  isConnected: () => !!stompClient?.connected,
};
