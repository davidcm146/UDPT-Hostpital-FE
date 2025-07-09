"use client"

import { useState } from "react"
import { Link, Navigate, Outlet, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Bell, Users, Calendar, Pill, BarChart3, LogOut, User, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/AuthContext"
import { toast } from "react-toastify"

const ReceptionistLayout = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { user, logout, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600 mb-4" />
        <h2 className="text-lg font-semibold text-teal-600">Loading ...</h2>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  if (user && user.role !== "RECEPTIONIST") {
    toast.error("You are not authorized to visit this page")
    return <Navigate to="/" replace />
  }

  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
  }

  // Mock receptionist data
  const receptionist = {
    name: "Sarah Johnson",
    role: "Receptionist",
    department: "Reception",
    avatar: "/placeholder.svg?height=40&width=40",
    notifications: 5,
  }

  // Navigation items - logout button is NOT included here as requested
  const navigationItems = [
    {
      path: "/receptionist/patients",
      label: "Patient Management",
      icon: Users,
    },
    {
      path: "/receptionist/appointments",
      label: "Appointment",
      icon: Calendar,
    },
    {
      path: "/receptionist/medicines",
      label: "Medicine Management",
      icon: Pill,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center mr-6">
                <div className="h-8 w-8 rounded-md bg-teal-600 flex items-center justify-center text-white font-bold mr-2">
                  ABC
                </div>
                <span className="text-xl font-bold text-gray-900">
                  <span className="text-teal-600">ABC</span> Hospital
                </span>
              </Link>
              <span className="hidden md:inline-block text-gray-500">Receptionist Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-teal-600 relative">
                      <Bell className="h-5 w-5" />
                      {receptionist.notifications > 0 && (
                        <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-medium">
                          {receptionist.notifications}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Desktop Profile Dropdown */}
              <div className="hidden md:flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={receptionist.avatar || "/placeholder.svg"} alt={receptionist.name} />
                        <AvatarFallback className="bg-teal-600 text-white">SJ</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-medium">{receptionist.name}</span>
                        <span className="text-xs text-gray-500">{receptionist.role}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/receptionist/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center p-4 border-b bg-teal-600 text-white rounded-t-lg">
                      <Avatar className="h-10 w-10 mr-3 border-2 border-white">
                        <AvatarImage src={receptionist.avatar || "/placeholder.svg"} alt={receptionist.name} />
                        <AvatarFallback className="bg-teal-700 text-white">SJ</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-lg font-semibold">{receptionist.name}</h2>
                        <p className="text-sm text-teal-100">
                          {receptionist.role} • {receptionist.department}
                        </p>
                      </div>
                    </div>
                    <nav className="flex-1 overflow-auto py-6">
                      <ul className="space-y-2 px-2">
                        {navigationItems.map((item) => (
                          <li key={item.path}>
                            <Link
                              to={item.path}
                              className={`flex items-center px-3 py-2.5 rounded-lg ${
                                isActive(item.path)
                                  ? "bg-teal-50 text-teal-600 font-medium"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                              onClick={() => setIsOpen(false)}
                            >
                              <item.icon className="mr-3 h-5 w-5" />
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                    {/* Mobile logout button - easily accessible */}
                    <div className="p-4 border-t">
                      <Button
                        variant="outline"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                        onClick={logout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Sidebar - Desktop Only */}
        <aside className="hidden md:block w-64 bg-white border-r shadow-sm">
          <div className="flex flex-col h-full">
            <div className="flex items-center p-4 border-b">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={receptionist.avatar || "/placeholder.svg"} alt={receptionist.name} />
                <AvatarFallback className="bg-teal-600 text-white">SJ</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">{receptionist.name}</h2>
                <p className="text-sm text-gray-500">
                  {receptionist.role} • {receptionist.department}
                </p>
              </div>
            </div>
            <nav className="flex-1 overflow-auto py-6">
              <ul className="space-y-2 px-2">
                {navigationItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-3 py-2.5 rounded-lg ${
                        isActive(item.path) ? "bg-teal-50 text-teal-600 font-medium" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default ReceptionistLayout
