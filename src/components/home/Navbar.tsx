"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBars,
  faHospital,
  faCalendarAlt,
  faUserMd,
  faSignInAlt,
  faUserPlus,
  faUserCircle,
  faChevronDown,
  faSignOutAlt,
  faBell,
} from "@fortawesome/free-solid-svg-icons"
import { Calendar } from "lucide-react"
import { useAuth } from "@/hooks/AuthContext"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3)
  const location = useLocation()

  const { user, logout } = useAuth();
  // console.log(token);
  const isLoggedIn = !!user

  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    logout()
  }

  const handleNotificationClick = () => {
    console.log("Notifications clicked")
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b px-8">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <FontAwesomeIcon icon={faHospital} className="h-6 w-6 text-teal-600 mr-2" />
              <span className="text-xl font-bold text-teal-600">ABC Hospital</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md ${
                isActive("/") ? "text-teal-600 font-medium" : "text-gray-700 hover:text-teal-600"
              } transition-colors`}
            >
              Home
            </Link>

            <Link
              to="/about"
              className={`px-3 py-2 rounded-md ${
                isActive("/about") ? "text-teal-600 font-medium" : "text-gray-700 hover:text-teal-600"
              } transition-colors`}
            >
              About
            </Link>

            {/* Notification Bell and User Dropdown Menu (when logged in) */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-4 ml-4">
                {/* Notification Bell */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNotificationClick}
                  className="relative text-gray-700 hover:text-teal-600"
                >
                  <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                  )}
                </Button>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 hover:text-teal-600">
                      <FontAwesomeIcon icon={faUserCircle} className="h-5 w-5" />
                      <span>My Account</span>
                      <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center w-full px-2 py-2 text-sm">
                        <FontAwesomeIcon icon={faUserCircle} className="mr-2 h-4 w-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/find-doctor" className="flex items-center w-full px-2 py-2 text-sm">
                        <FontAwesomeIcon icon={faUserMd} className="mr-2 h-4 w-4" />
                        Find a Doctor
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/medical-record" className="flex items-center w-full px-2 py-2 text-sm">
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 h-4 w-4" />
                        Examination Schedule
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/appointments" className="flex items-center w-full px-2 py-2 text-sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Appointments
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center w-full px-2 py-2 text-sm text-red-600 focus:text-red-600"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              /* Login/Register Buttons (when not logged in) */
              <div className="flex items-center space-x-2 ml-4">
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white"
                  >
                    <FontAwesomeIcon icon={faSignInAlt} className="mr-1 h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                    <FontAwesomeIcon icon={faUserPlus} className="mr-1 h-4 w-4" />
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Toggle menu">
                  <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    to="/"
                    className={`block px-3 py-2 rounded-md ${
                      isActive("/") ? "bg-teal-50 text-teal-600 font-medium" : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>

                  <Link
                    to="/about"
                    className={`block px-3 py-2 rounded-md ${
                      isActive("/about") ? "bg-teal-50 text-teal-600 font-medium" : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    About
                  </Link>

                  {/* Mobile User Menu Items (when logged in) */}
                  {!isLoggedIn && (
                    <>
                      <div className="border-t border-gray-200 my-2"></div>

                      {/* Mobile Notifications */}
                      <button
                        onClick={() => {
                          handleNotificationClick()
                          setIsOpen(false)
                        }}
                        className="flex items-center justify-between px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faBell} className="mr-2 h-4 w-4" />
                          Notifications
                        </div>
                        {notificationCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {notificationCount > 9 ? "9+" : notificationCount}
                          </span>
                        )}
                      </button>

                      <div className="px-3 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                        My Account
                      </div>

                      <Link
                        to="/profile"
                        className={`block px-3 py-2 rounded-md ${
                          isActive("/profile")
                            ? "bg-teal-50 text-teal-600 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <FontAwesomeIcon icon={faUserCircle} className="mr-2 h-4 w-4" />
                        My Profile
                      </Link>

                      <Link
                        to="/find-doctor"
                        className={`block px-3 py-2 rounded-md ${
                          isActive("/find-doctor")
                            ? "bg-teal-50 text-teal-600 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <FontAwesomeIcon icon={faUserMd} className="mr-2 h-4 w-4" />
                        Find a Doctor
                      </Link>

                      <Link
                        to="/medical-record"
                        className={`block px-3 py-2 rounded-md ${
                          isActive("/medical-record") || location.pathname.includes("/examination")
                            ? "bg-teal-50 text-teal-600 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 h-4 w-4" />
                        Examination Schedule
                      </Link>

                      <Link
                        to="/appointments"
                        className={`block px-3 py-2 rounded-md ${
                          isActive("/appointments")
                            ? "bg-teal-50 text-teal-600 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Appointments
                      </Link>

                      <button
                        onClick={() => {
                          handleLogout()
                          setIsOpen(false)
                        }}
                        className="block w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 h-4 w-4" />
                        Logout
                      </button>
                    </>
                  )}

                  {/* Mobile Login/Register (when not logged in) */}
                  {!isLoggedIn && (
                    <>
                      <div className="border-t border-gray-200 my-2"></div>
                      <div className="flex flex-col space-y-2 pt-2 px-3">
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                          <Button
                            variant="outline"
                            className="border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white w-full"
                          >
                            <FontAwesomeIcon icon={faSignInAlt} className="mr-2 h-4 w-4" />
                            Login
                          </Button>
                        </Link>
                        <Link to="/register" onClick={() => setIsOpen(false)}>
                          <Button className="bg-teal-600 hover:bg-teal-700 text-white w-full">
                            <FontAwesomeIcon icon={faUserPlus} className="mr-2 h-4 w-4" />
                            Register
                          </Button>
                        </Link>
                      </div>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
