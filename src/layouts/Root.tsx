import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Root = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <main className="flex-1 bg-gray-50">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Root;
