"use client"

import { Loader2, Heart, Activity, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingProps {
  message?: string
  subMessage?: string
  variant?: "default" | "heartbeat" | "medical" | "pulse"
  className?: string
}

export function Loading({
  message = "Loading...",
  subMessage = "Please wait while we process your request",
  variant = "default",
  className,
}: LoadingProps) {
  const renderLoadingIcon = () => {
    switch (variant) {
      case "heartbeat":
        return (
          <div className="relative">
            <Heart className="h-12 w-12 text-teal-600 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-2 w-2 bg-red-500 rounded-full animate-ping" />
            </div>
          </div>
        )
      case "medical":
        return (
          <div className="relative">
            <div className="h-16 w-16 bg-teal-600 rounded-full flex items-center justify-center animate-pulse">
              <Plus className="h-8 w-8 text-white" />
            </div>
          </div>
        )
      case "pulse":
        return (
          <div className="flex items-center space-x-1">
            <Activity className="h-8 w-8 text-teal-600" />
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-1 bg-teal-600 animate-pulse"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: "1s",
                  }}
                />
              ))}
            </div>
          </div>
        )
      default:
        return <Loader2 className="h-12 w-12 text-teal-600 animate-spin" />
    }
  }

  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm", className)}>
      <div className="flex flex-col items-center space-y-6 p-8">

        {/* Loading Animation */}
        <div className="flex flex-col items-center space-y-4">
          {renderLoadingIcon()}

          {/* Loading Text */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">{message}</h3>
            <p className="text-sm text-gray-600 max-w-sm">{subMessage}</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-600 rounded-full animate-pulse"
            style={{
              animation: "loading-progress 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes loading-progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  )
}
