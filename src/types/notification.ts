export interface Notification {
    id: number
    body: string
    channel: string
    isRead: boolean
    receiverId: number
    sentAt: string
    title: string
    type: string
    updatedAt: string
}

export interface NotificationParams {
    userId: string,
    page: number,
    pageSize: number,
    channel: string
}