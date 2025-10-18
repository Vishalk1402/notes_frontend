// components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-4 mt-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center items-center px-6">
        <p className="text-sm">&copy; {new Date().getFullYear()} StudyHub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
