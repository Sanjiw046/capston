import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between">
        {/* Left Section - Company Info (50%) */}
        <div className="md:w-1/2">
          <h2 className="text-lg font-semibold">Capston</h2>
          <p className="text-gray-400 text-sm mt-2">
            Welcome to our online order website!
            We are a leading food-tech company providing the best services to our customers. 
            Enjoy delicious food from top restaurants with amazing offers.
            Here, you can browse our wide selection of products and place orders from the comfort of your own home.
          </p>
        </div>

        {/* Right Section - Company Links (50%) */}
        <div className="md:w-1/2 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-2">Company</h3>
          <div className="text-gray-400 flex justify-center gap-6">
            <a href="#" className="!text-gray-600 transition-colors duration-300 hover:text-yellow-500">
              About Us
            </a>
            <a href="#" className="!text-gray-600 transition-colors duration-300 hover:text-yellow-500">
              Contact Us
            </a>
            <a href="#" className="!text-gray-600 transition-colors duration-300 hover:text-yellow-500">
              Offers
            </a>
            <a href="#" className="!text-gray-600 transition-colors duration-300 hover:text-yellow-500">
              FAQ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
