import { Outlet } from 'react-router-dom'
import { ThemeProvider } from "../hooks/ThemeProvider"
import Navbar from "../components/home/Navbar"
import Footer from "../components/home/Footer"

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="hospital-theme">
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
