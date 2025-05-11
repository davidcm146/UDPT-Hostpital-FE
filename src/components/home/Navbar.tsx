"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faHospital } from "@fortawesome/free-solid-svg-icons"

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
            <Link to="/" className="flex items-center px-8">
              <FontAwesomeIcon icon={faHospital} className="h-6 w-6 text-teal-600 mr-2" />
              <span className="text-xl font-bold text-teal-600">ABC Hospital</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 py-4 px-8">
            <Link
              to="/"
              className={`${isActive("/") ? "text-teal-600 font-medium" : "text-gray-700"} hover:text-teal-600 transition-colors`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`${isActive("/about") ? "text-teal-600 font-medium" : "text-gray-700"} hover:text-teal-600 transition-colors`}
            >
              About
            </Link>

            <Link className="mr-4" to="/login">
              <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">Register</Button>
            </Link>
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
                    className={`block px-3 py-2 rounded-md ${isActive("/") ? "bg-teal-50 text-teal-600 font-medium" : "text-gray-700 hover:bg-gray-100"}`}
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/about"
                    className={`block px-3 py-2 rounded-md ${isActive("/about") ? "bg-teal-50 text-teal-600 font-medium" : "text-gray-700 hover:bg-gray-100"}`}
                    onClick={() => setIsOpen(false)}
                  >
                    About
                  </Link>

                  <div className="flex flex-col space-y-2 pt-2 px-4">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="outline"
                        className="border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white w-full"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      <Button className="bg-teal-600 hover:bg-teal-700 text-white w-full">Register</Button>
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
