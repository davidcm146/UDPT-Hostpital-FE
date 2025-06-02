"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBars,
  faHospital,
  faCalendarAlt,
  faUserMd,
  faPrescriptionBottleMedical,
  faSignInAlt,
  faUserPlus,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
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

            {/* Find a Doctor */}
            <Link
              to="/find-doctor"
              className={`px-3 py-2 rounded-md ${
                isActive("/find-doctor") ? "text-teal-600 font-medium" : "text-gray-700 hover:text-teal-600"
              } transition-colors`}
            >
              <span className="flex items-center">
                <FontAwesomeIcon icon={faUserMd} className="mr-1 h-4 w-4" />
                Find a Doctor
              </span>
            </Link>

            {/* Examination Schedule */}
            <Link
              to="/medical-schedule"
              className={`px-3 py-2 rounded-md ${
                isActive("/medical-schedule") || location.pathname.includes("/examination")
                  ? "text-teal-600 font-medium"
                  : "text-gray-700 hover:text-teal-600"
              } transition-colors`}
            >
              <span className="flex items-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 h-4 w-4" />
                Examination Schedule
              </span>
            </Link>

            {/* Prescriptions */}
            <Link
              to="/prescriptions"
              className={`px-3 py-2 rounded-md ${
                isActive("/prescriptions") ? "text-teal-600 font-medium" : "text-gray-700 hover:text-teal-600"
              } transition-colors`}
            >
              <span className="flex items-center">
                <FontAwesomeIcon icon={faPrescriptionBottleMedical} className="mr-1 h-4 w-4" />
                Prescriptions
              </span>
            </Link>

            <Link
              to="/profile"
              className={`px-3 py-2 rounded-md ${
                isActive("/profile") ? "text-teal-600 font-medium" : "text-gray-700 hover:text-teal-600"
              } transition-colors`}
            >
              <span className="flex items-center">
                <FontAwesomeIcon icon={faUserCircle} className="mr-1 h-4 w-4" />
                My Profile
              </span>
            </Link>

            {/* About */}
            <Link
              to="/about"
              className={`px-3 py-2 rounded-md ${
                isActive("/about") ? "text-teal-600 font-medium" : "text-gray-700 hover:text-teal-600"
              } transition-colors`}
            >
              About
            </Link>

            {/* Login/Register Buttons */}
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
                    to="/medical-schedule"
                    className={`block px-3 py-2 rounded-md ${
                      isActive("/medical-schedule") || location.pathname.includes("/examination")
                        ? "bg-teal-50 text-teal-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 h-4 w-4" />
                    Examination Schedule
                  </Link>
                  <Link
                    to="/prescriptions"
                    className={`block px-3 py-2 rounded-md ${
                      isActive("/prescriptions")
                        ? "bg-teal-50 text-teal-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <FontAwesomeIcon icon={faPrescriptionBottleMedical} className="mr-2 h-4 w-4" />
                    Prescriptions
                  </Link>
                  <Link
                    to="/profile"
                    className={`block px-3 py-2 rounded-md ${
                      isActive("/profile") ? "bg-teal-50 text-teal-600 font-medium" : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <FontAwesomeIcon icon={faUserCircle} className="mr-2 h-4 w-4" />
                    My Profile
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
