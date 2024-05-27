import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white text-black py-8">
      <div className="container h-auto mx-auto flex flex-col items-center">
        <div className="flex items-center mb-4">
          <PawPrintIcon className="h-8 w-8 mr-2 text-black-400" />
          <h3 className="text-xl font-bold">Animal Tracking</h3>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-600">
          <a className="hover:text-gray-900" href="#">
            Privacy Policy
          </a>
          <a className="hover:text-gray-900" href="#">
            Terms of Service
          </a>
          <a className="hover:text-gray-900" href="#">
            Cookie Policy
          </a>
        </div>
        <p className="text-sm text-gray-500 mt-4">© 2024 Animal Tracking. All rights reserved.</p>
      </div>
    </footer>
  );
};

const PawPrintIcon = (props) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="4" r="2" />
      <circle cx="18" cy="8" r="2" />
      <circle cx="20" cy="16" r="2" />
      <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
    </svg>
  );
};

export default Footer;
