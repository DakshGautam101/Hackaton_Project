import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="size-4">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="#E87D30"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Street Eats</h2>
            </Link>
            <p className="mt-4 text-gray-600">
              Connecting street food vendors with reliable suppliers. Join our community to grow your business.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/marketplace" className="text-gray-600 hover:text-orange-500">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/pools" className="text-gray-600 hover:text-orange-500">
                  Group Buying
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-gray-600 hover:text-orange-500">
                  Find Nearby
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">
                <span className="font-medium">Email:</span> support@streeteats.com
              </li>
              <li className="text-gray-600">
                <span className="font-medium">Phone:</span> +91 123 456 7890
              </li>
              <li className="text-gray-600">
                <span className="font-medium">Hours:</span> 9:00 AM - 6:00 PM IST
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Street Eats. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-orange-500 text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-orange-500 text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;