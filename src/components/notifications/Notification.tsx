import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bell, Calendar, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react"
import { useNotificationSocket } from "@/hooks/useNotificationSocket"
import { notificationService } from "@/services/notificationService"
import type { Notification } from "@/types/notification"

interface NotificationsProps {
  className?: string
  userId: string
  channel?: string
}

export function Notifications({ className, userId, channel = "IN_APP" }: NotificationsProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const pageSize = 10

  // Load unread count from API
  const loadUnreadCount = useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount(userId, channel)
      setUnreadCount(count)
    } catch (err) {
      console.error("Failed to load unread count:", err)
    }
  }, [userId, channel])

  // Handle new notifications from WebSocket
  const handleNewNotification = useCallback(
    (notification: Notification) => {
      console.log("New notification received:", notification)

      setNotifications((prev) => {
        // Check if notification already exists to prevent duplicates
        const existingIndex = prev.findIndex((n) => n.id === notification.id)

        if (existingIndex >= 0) {
          // Update existing notification
          const updated = [...prev]
          updated[existingIndex] = notification
          return updated
        } else {
          // Add new notification at the beginning
          return [notification, ...prev]
        }
      })

      // Refresh unread count from API when new notification arrives
      if (!notification.isRead) {
        loadUnreadCount()
      }
    },
    [loadUnreadCount],
  )

  // Initialize WebSocket connection
  useNotificationSocket(userId, handleNewNotification)

  // Load initial notifications
  const loadNotifications = useCallback(
    async (pageNum = 0, reset = false) => {
      try {
        if (pageNum === 0) {
          setLoading(true)
        } else {
          setLoadingMore(true)
        }
        setError(null)

        const newNotifications = await notificationService.getNotifications({
          userId,
          channel,
          page: pageNum,
          pageSize,
        })

        setNotifications((prev) => {
          if (reset || pageNum === 0) {
            return newNotifications
          } else {
            // Merge notifications and remove duplicates based on ID
            const existingIds = new Set(prev.map((n) => n.id))
            const uniqueNewNotifications = newNotifications.filter((n) => !existingIds.has(n.id))
            return [...prev, ...uniqueNewNotifications]
          }
        })

        setHasMore(newNotifications.length === pageSize)
        setPage(pageNum)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load notifications")
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [userId, channel, pageSize],
  )

  // Load more notifications
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadNotifications(page + 1, false)
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId: number) => {
    // Find the notification to check if it's currently unread
    const notification = notifications.find((n) => n.id === notificationId)
    const wasUnread = notification && !notification.isRead

    // Optimistically update UI first - use isRead consistently
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification,
      ),
    )

    // Optimistically update unread count
    if (wasUnread) {
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }

    try {
      await notificationService.markAsRead(notificationId.toString(), userId)
      // Refresh unread count from API to ensure accuracy
      loadUnreadCount()
    } catch (err) {
      console.error("Failed to mark as read:", err)
      // Revert optimistic updates on error
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, isRead: false } : notification,
        ),
      )
      if (wasUnread) {
        setUnreadCount((prev) => prev + 1)
      }
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    // Store previous state for potential revert
    const previousNotifications = notifications
    const previousUnreadCount = unreadCount

    // Optimistically update UI first - use isRead consistently
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
    setUnreadCount(0)

    try {
      await notificationService.readAll(userId)
      // Refresh unread count from API to ensure accuracy
      loadUnreadCount()
    } catch (err) {
      console.error("Failed to mark all as read:", err)
      // Revert optimistic updates on error
      setNotifications(previousNotifications)
      setUnreadCount(previousUnreadCount)
    }
  }

  // Handle notification click
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
    if (!showNotifications) {
      // Load notifications and unread count when opening
      loadNotifications(0, true)
      loadUnreadCount()
    }
  }

  // Load unread count on mount
  useEffect(() => {
    if (userId) {
      loadUnreadCount()
    }
  }, [loadUnreadCount])

  const getIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-4 w-4 text-blue-500" />
      case "results":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "prescription":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "reminder":
        return <AlertCircle className="h-4 w-4 text-purple-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return "1 day ago"
    if (diffInDays < 7) return `${diffInDays} days ago`
    return date.toLocaleDateString()
  }

  // Remove duplicates and sort notifications by sentAt (newest first)
  const uniqueNotifications = notifications
    .filter((notification, index, self) => index === self.findIndex((n) => n.id === notification.id))
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())

  return (
    <Popover open={showNotifications} onOpenChange={setShowNotifications}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNotificationClick}
          className={`relative text-gray-700 hover:text-teal-600 ${className}`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Notifications</h3>
              <p className="text-sm text-gray-600">
                {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-teal-600 hover:text-teal-700"
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-500">Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              <p className="text-sm">{error}</p>
              <Button variant="ghost" size="sm" onClick={() => loadNotifications(0, true)} className="mt-2">
                Try again
              </Button>
            </div>
          ) : uniqueNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <>
              {uniqueNotifications.map((notification) => (
                <div
                  key={`notification-${notification.id}`}
                  className={`p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{notification.body}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-400">{formatTime(notification.sentAt)}</p>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                          {notification.channel}
                        </span>
                      </div>
                    </div>
                    {!notification.isRead && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Load More Button */}
              {hasMore && (
                <div className="p-3 border-t">
                  <Button variant="ghost" className="w-full text-sm" onClick={handleLoadMore} disabled={loadingMore}>
                    {loadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading more...
                      </>
                    ) : (
                      "Load more"
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
