import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const SOCKET_URL = `${process.env.REACT_APP_API_BASE_URL}/ws-notifications`;
let stompClient: Client | null = null;

export const notificationSocket = {
  connect: (userId: string, onNewNotification: (notif: any) => void) => {
    const token = localStorage.getItem("token");

    if (stompClient?.active) {
      return;
    }

    stompClient = new Client({
      webSocketFactory: () => new SockJS(SOCKET_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (msg) => console.log("[STOMP DEBUG]", msg),

      // add token to STOMP headers
      connectHeaders: {
        Authorization: token ? `Bearer ${token}` : "",
      },

      onConnect: (frame) => {
        const topic = `/user/queue/notifications`;
        stompClient?.subscribe(
          topic,
          (message: IMessage) => {
            try {
              const notif = JSON.parse(message.body);
              onNewNotification(notif);
            } catch (e) {;
            }
          }
        );
      },

      onStompError: (frame) => {
      },

      onWebSocketClose: (evt) => console.warn("⚠️ WebSocket closed:", evt),
    });
    stompClient.activate();
  },

  disconnect: () => {
    if (stompClient?.active) {
      stompClient.deactivate();
      stompClient = null;
    } else {
    }
  },

  isConnected: (): boolean => {
    const connected = !!stompClient?.connected;
    return connected;
  },
};
