import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-green-600 text-white pt-10 relative z-10 print:hidden">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10">
        {/* Get In Touch */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Get In Touch</h2>
          <p className="mb-2">📍 123 Street, New York, USA</p>
          <p className="mb-2">✉️ info@example.com</p>
          <p className="mb-4">📞 +012 345 67890</p>
          <div className="flex space-x-3">
            <a href="#" className="bg-orange-400 text-white p-2 rounded-full hover:bg-orange-500">
              <FaTwitter />
            </a>
            <a href="#" className="bg-orange-400 text-white p-2 rounded-full hover:bg-orange-500">
              <FaFacebookF />
            </a>
            <a href="#" className="bg-orange-400 text-white p-2 rounded-full hover:bg-orange-500">
              <FaLinkedinIn />
            </a>
            <a href="#" className="bg-orange-400 text-white p-2 rounded-full hover:bg-orange-500">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline">
                → Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                → About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                → Our Services
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                → Meet The Team
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                → Latest Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                → Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Popular Links */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Popular Links</h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline">
                → Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                → About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                → Our Services
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                → Meet The Team
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                → Latest Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                → Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="bg-orange-400 text-center text-white rounded-lg p-6">
          <h2 className="text-xl font-bold mb-2">Newsletter</h2>
          <p className="mb-4">Subscribe Our Newsletter</p>
          <p className="text-sm mb-4">Amet justo diam dolor rebum lorem sit stet sea justo kasd</p>
          <form className="flex">
            <input type="email" placeholder="Your Email" className="w-full p-2 rounded-l-md text-black" />
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-r-md font-semibold">
              Sign Up
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-green-800 text-center text-sm py-4 px-2 text-gray-200">
        © <span className="text-orange-400 font-semibold">2025 Krishi Seva Kendra.</span>. All Rights Reserved. Designed by <span className="text-orange-400">MN Developer</span>
      </div>
    </footer>
  );
};

export default Footer;
