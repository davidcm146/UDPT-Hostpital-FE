import Cookies from "js-cookie"
import { Response } from "@/types/api"
import type { Notification, NotificationParams } from "@/types/notification"

export class notificationService {
  private static baseUrl = "http://localhost:8080";

  static async getNotifications({
    userId,
    channel,
    page,
    pageSize,
  }: NotificationParams): Promise<Notification[]> {
    const res = await fetch(
      `${this.baseUrl}/notifications?userId=${userId}&channel=${channel}&page=${page}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    )

    if (!res.ok) throw new Error("Failed to fetch notifications")

    const json: Response<Notification> = await res.json()

    if (json.code !== 200) {
      throw new Error(json.message || "Unknown error")
    }

    if (!json.data || !Array.isArray(json.data)) {
      throw new Error("Invalid response format")
    }

    return json.data
  }

  static async getUnreadCount(userId: string, channel: string): Promise<number> {
    const res = await fetch(
      `${this.baseUrl}/notifications/count-unread?userId=${userId}&channel=${channel}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    )

    if (!res.ok) throw new Error("Failed to fetch unread count")

    const json: Response<number> = await res.json()

    if (json.code !== 200 || typeof json.data !== "number") {
      throw new Error(json.message || "Invalid unread count response")
    }

    return json.data
  }


  static async markAsRead(notificationId: string, userId: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/notifications/${notificationId}/markAsRead`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ userId }),
      }
    )

    if (!res.ok) {
      throw new Error("Failed to mark notification as read")
    }

    const json: Partial<Response<any>> = await res.json();

    if (json.code !== 200) {
      throw new Error(json.message || "Failed to mark as read")
    }
  }

  static async readAll(userId: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/notifications/read-all`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({ userId }),
    })

    if (!res.ok) {
      throw new Error("Failed to mark all as read")
    }

    const json: Partial<Response<any>> = await res.json();

    if (json.code !== 200) {
      throw new Error(json.message || "Failed to mark all as read")
    }
  }
}
