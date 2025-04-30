import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHospital, 
  faPhone, 
  faEnvelope, 
  faMapMarkerAlt 
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebook, 
  faTwitter, 
  faInstagram, 
  faLinkedin 
} from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Top section with logo and info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-blue-700">
          {/* Hospital Info */}
          <div>
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faHospital} className="text-blue-300 text-2xl mr-2" />
              <h2 className="text-xl font-bold">Bệnh viện ABC</h2>
            </div>
            <p className="text-blue-200 mb-4">
              Providing quality healthcare services with compassion and excellence since 1985.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-300 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </a>
              <a href="#" className="text-blue-300 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a href="#" className="text-blue-300 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
              <a href="#" className="text-blue-300 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faLinkedin} size="lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-300 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Services</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Doctors</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Appointments</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Patient Portal</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-300 mt-1 mr-3" />
                <span>123 Health Avenue, Medical District, City</span>
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faPhone} className="text-blue-300 mr-3" />
                <span>+84 123 456 7890</span>
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="text-blue-300 mr-3" />
                <span>contact@benhvienabc.com</span>
              </li>
              <li className="mt-4 pt-2 border-t border-blue-700">
                <span className="block text-blue-300 font-medium">Emergency Hotline</span>
                <span className="text-lg font-bold">+84 911 911 911</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-blue-200 text-sm">
          <div className="mb-2 md:mb-0">
            © {currentYear} Bệnh viện ABC. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-300 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
