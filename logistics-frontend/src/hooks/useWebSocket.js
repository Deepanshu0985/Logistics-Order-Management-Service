import { useEffect, useRef, useState, useCallback } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

export function useWebSocket(onNotification) {
    const [connected, setConnected] = useState(false);
    const stompClient = useRef(null);
    const reconnectTimeout = useRef(null);

    const connect = useCallback(() => {
        try {
            const socket = new SockJS("http://localhost:8080/ws");
            stompClient.current = Stomp.over(socket);

            // Disable debug logging in production
            stompClient.current.debug = () => { };

            stompClient.current.connect(
                {},
                () => {
                    setConnected(true);
                    console.log("WebSocket connected");

                    // Subscribe to order updates
                    stompClient.current.subscribe("/topic/orders", (message) => {
                        try {
                            const notification = JSON.parse(message.body);
                            onNotification?.(notification);
                        } catch (e) {
                            console.error("Failed to parse notification:", e);
                        }
                    });
                },
                (error) => {
                    console.error("WebSocket error:", error);
                    setConnected(false);

                    // Attempt to reconnect after 5 seconds
                    reconnectTimeout.current = setTimeout(() => {
                        console.log("Attempting to reconnect...");
                        connect();
                    }, 5000);
                }
            );
        } catch (e) {
            console.error("Failed to create WebSocket:", e);
        }
    }, [onNotification]);

    const disconnect = useCallback(() => {
        if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
        }
        if (stompClient.current) {
            stompClient.current.disconnect();
            setConnected(false);
        }
    }, []);

    useEffect(() => {
        connect();
        return () => disconnect();
    }, [connect, disconnect]);

    return { connected };
}
