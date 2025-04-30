import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHospital,
  faCalendarCheck,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gray-50 shadow-sm py-2 px-6">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faHospital} className="text-blue-600 text-2xl" />
            <h1 className="text-2xl font-semibold text-blue-700">Bệnh Viện ABC</h1>
          </div>

          <button
            className="md:hidden text-2xl text-blue-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
          </button>

          <div className="hidden md:flex items-center gap-6">
            {/* Nav links */}
            <Link to="/" className="text-gray-600 hover:text-blue-700 font-medium">Trang chủ</Link>
            <Link to="/services" className="text-gray-600 hover:text-blue-700 font-medium">Dịch vụ</Link>
            <Link to="/doctors" className="text-gray-600 hover:text-blue-700 font-medium">Bác sĩ</Link>
            <Link to="/departments" className="text-gray-600 hover:text-blue-700 font-medium">Khoa phòng</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-700 font-medium">Giới thiệu</Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-700 font-medium">Liên hệ</Link>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {/* Action buttons */}
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
            >
              Đăng nhập
            </Link>
            <Link
              to="/book-appointment"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faCalendarCheck} />
              <span>Đặt lịch khám</span>
            </Link>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-4 border-t pt-4">
            <Link to="/" className="text-gray-600 hover:text-blue-700 font-medium">Trang chủ</Link>
            <Link to="/services" className="text-gray-600 hover:text-blue-700 font-medium">Dịch vụ</Link>
            <Link to="/doctors" className="text-gray-600 hover:text-blue-700 font-medium">Bác sĩ</Link>
            <Link to="/departments" className="text-gray-600 hover:text-blue-700 font-medium">Khoa phòng</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-700 font-medium">Giới thiệu</Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-700 font-medium">Liên hệ</Link>
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition text-center"
            >
              Đăng nhập
            </Link>
            <Link
              to="/book-appointment"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition flex justify-center items-center gap-2"
            >
              <FontAwesomeIcon icon={faCalendarCheck} />
              <span>Đặt lịch khám</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
