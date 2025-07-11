import { useEffect, useRef } from "react"
import SockJS from "sockjs-client"
import { Client, over } from "stompjs"
import { Notification } from "@/types/notification"

let stompClient: Client | null = null

export const useNotificationSocket = (
  userId: string,
  onReceive: (notification: Notification) => void
) => {
  const connectedRef = useRef(false)

  useEffect(() => {
    if (!userId || connectedRef.current) return

    const socket = new SockJS('http://localhost:8084/ws');
    stompClient = over(socket)

    stompClient.connect({}, () => {
      console.log("connected to server", socket?.url || "unknown")
      stompClient?.subscribe(`/topic/notifications/${userId}`, (msg) => {
        const data: Notification = JSON.parse(msg.body)
        onReceive(data)
      })
      connectedRef.current = true
    })

    return () => {
      if (stompClient?.connected) {
        stompClient.disconnect(() => {
          connectedRef.current = false
        })
      }
    }
  }, [userId, onReceive])
}
