import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserMd,
  faCalendarCheck,
  faPills,
  faPhone,
  faChartBar,
  faHospital,
  faAmbulance,
  faIdCard,
  faStethoscope,
  faHeartbeat,
  faSearch,
  faArrowRight,
  faMapMarkerAlt,
  faClock,
  faEnvelope,
  faUser
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const departments = [
    { name: "Cardiology", icon: faHeartbeat, description: "Leading heart care with advanced diagnostic and treatment options" },
    { name: "Neurology", icon: faStethoscope, description: "Comprehensive neurological services for all brain and nervous system conditions" },
    { name: "Pediatrics", icon: faUserMd, description: "Specialized care for infants, children, and adolescents" },
    { name: "Orthopedics", icon: faHospital, description: "Expert care for bone, joint, and muscle conditions" }
  ];

  const testimonials = [
    { name: "Nguyễn Văn A", text: "Dịch vụ y tế tuyệt vời, đội ngũ bác sĩ tận tình và chuyên nghiệp." },
    { name: "Trần Thị B", text: "Tôi đã được chăm sóc rất chu đáo trong thời gian điều trị tại bệnh viện ABC." },
    { name: "Lê Văn C", text: "Cảm ơn bệnh viện đã cứu sống tôi khi nguy cấp, đội ngũ y bác sĩ rất giỏi." }
  ];

  const doctors = [
    { name: "TS. BS. Nguyễn Văn Minh", specialty: "Chuyên khoa Tim mạch", img: "/api/placeholder/300/300" },
    { name: "PGS. TS. Trần Thị Hoa", specialty: "Chuyên khoa Nhi", img: "/api/placeholder/300/300" },
    { name: "BS. CKI. Lê Thanh Tùng", specialty: "Chuyên khoa Nội", img: "/api/placeholder/300/300" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-900 opacity-90"></div>
        <div className="container mx-auto px-8 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Chăm sóc sức khỏe chất lượng cao</h2>
            <p className="text-xl mb-8 text-blue-100">
              Bệnh viện ABC cam kết mang đến dịch vụ y tế tốt nhất với đội ngũ bác sĩ giàu kinh nghiệm
              và trang thiết bị hiện đại.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/book-appointment" className="px-6 py-3 bg-white text-blue-600 rounded-md font-medium hover:bg-blue-50">
                Đặt lịch khám ngay
              </Link>
              <Link to="/emergency" className="px-6 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 flex items-center justify-center">
                <FontAwesomeIcon icon={faAmbulance} className="mr-2" /> Dịch vụ cấp cứu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="relative max-w-3xl mx-auto">
            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ y tế, bác sĩ, thông tin sức khỏe..."
              className="w-full pl-12 pr-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="p-6">
        {/* Services Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Dịch vụ y tế</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Chúng tôi cung cấp nhiều dịch vụ y tế chất lượng cao nhằm đáp ứng nhu cầu chăm sóc sức khỏe của bạn và gia đình.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faStethoscope} className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Khám tổng quát</h3>
                <p className="text-gray-600 mb-4">
                  Dịch vụ khám sức khỏe tổng quát định kỳ giúp phát hiện sớm các vấn đề sức khỏe tiềm ẩn.
                </p>
                <Link to="/services/general-checkup" className="text-blue-600 hover:text-blue-800 flex items-center font-medium">
                  Tìm hiểu thêm <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </Link>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faHeartbeat} className="text-green-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Chuyên khoa Tim mạch</h3>
                <p className="text-gray-600 mb-4">
                  Đội ngũ bác sĩ chuyên khoa tim mạch giàu kinh nghiệm với trang thiết bị hiện đại.
                </p>
                <Link to="/services/cardiology" className="text-blue-600 hover:text-blue-800 flex items-center font-medium">
                  Tìm hiểu thêm <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </Link>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faPills} className="text-purple-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Dược phẩm</h3>
                <p className="text-gray-600 mb-4">
                  Nhà thuốc đảm bảo chất lượng với đầy đủ các loại thuốc và tư vấn sử dụng thuốc an toàn.
                </p>
                <Link to="/services/pharmacy" className="text-blue-600 hover:text-blue-800 flex items-center font-medium">
                  Tìm hiểu thêm <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </Link>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
                <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faUserMd} className="text-yellow-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Sản - Nhi</h3>
                <p className="text-gray-600 mb-4">
                  Chăm sóc sức khỏe bà mẹ và trẻ em với các bác sĩ chuyên khoa giàu kinh nghiệm.
                </p>
                <Link to="/services/obstetrics-pediatrics" className="text-blue-600 hover:text-blue-800 flex items-center font-medium">
                  Tìm hiểu thêm <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </Link>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faAmbulance} className="text-red-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Cấp cứu 24/7</h3>
                <p className="text-gray-600 mb-4">
                  Dịch vụ cấp cứu hoạt động 24/7 với đội ngũ y bác sĩ luôn sẵn sàng ứng phó mọi tình huống.
                </p>
                <Link to="/services/emergency" className="text-blue-600 hover:text-blue-800 flex items-center font-medium">
                  Tìm hiểu thêm <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </Link>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faCalendarCheck} className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Khám chuyên khoa</h3>
                <p className="text-gray-600 mb-4">
                  Dịch vụ khám chuyên khoa với các bác sĩ hàng đầu trong nhiều lĩnh vực y tế.
                </p>
                <Link to="/services/specialist" className="text-blue-600 hover:text-blue-800 flex items-center font-medium">
                  Tìm hiểu thêm <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Departments */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Khoa phòng nổi bật</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Bệnh viện ABC tự hào với đội ngũ y bác sĩ giỏi chuyên môn, tận tâm và trang thiết bị hiện đại.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {departments.map((dept, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <FontAwesomeIcon icon={dept.icon} className="text-blue-600 text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{dept.name}</h3>
                  <p className="text-gray-600 mb-4">{dept.description}</p>
                  <Link to={`/departments/${dept.name.toLowerCase()}`} className="text-blue-600 hover:text-blue-800 flex items-center font-medium">
                    Chi tiết <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Doctors */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Đội ngũ bác sĩ</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Đội ngũ bác sĩ chuyên nghiệp, giàu kinh nghiệm và tận tâm với sức khỏe người bệnh.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor, index) => (
                <div key={index} className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                  <img src={doctor.img} alt={doctor.name} className="w-full h-64 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{doctor.name}</h3>
                    <p className="text-blue-600 mb-4">{doctor.specialty}</p>
                    <Link to={`/doctors/${index + 1}`} className="text-blue-600 hover:text-blue-800 flex items-center font-medium">
                      Xem hồ sơ <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/doctors" className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700">
                Xem tất cả bác sĩ
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Cảm nhận của bệnh nhân</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Những đánh giá từ các bệnh nhân đã sử dụng dịch vụ của bệnh viện ABC.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Đặt lịch khám ngay</h2>
              <p className="max-w-2xl mx-auto mb-8 text-blue-100">
                Chỉ mất vài phút để đặt lịch khám online. Tiết kiệm thời gian và được chăm sóc tốt hơn.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/book-appointment" className="px-6 py-3 bg-white text-blue-600 rounded-md font-medium hover:bg-blue-50">
                  Đặt lịch khám
                </Link>
                <Link to="/contact" className="px-6 py-3 border border-white text-white rounded-md font-medium hover:bg-blue-700">
                  Liên hệ tư vấn
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-1">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Địa chỉ</h3>
                  <p className="text-gray-600">123 Đường ABC, Quận 1<br />TP Hồ Chí Minh, Việt Nam</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-1">
                  <FontAwesomeIcon icon={faPhone} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Liên hệ</h3>
                  <p className="text-gray-600">Điện thoại: (028) 1234 5678<br />Email: info@benhvienabc.vn</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-1">
                  <FontAwesomeIcon icon={faClock} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Giờ làm việc</h3>
                  <p className="text-gray-600">Thứ Hai - Thứ Bảy: 07:00 - 20:00<br />Chủ Nhật: 07:00 - 12:00</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Đăng ký nhận tin sức khỏe</h2>
              <p className="text-gray-600 mb-6">
                Nhận thông tin mới nhất về sức khỏe, dịch vụ y tế và các chương trình khám chữa bệnh.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <button className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 whitespace-nowrap">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
