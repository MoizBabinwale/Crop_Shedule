// QuotationFooter.jsx
import React from "react";

const QuotationFooter = () => {
  return (
    <div>
      {/* Print Footer (every page) */}
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm text-sm leading-relaxed text-gray-800 block">
        <div className="w-full text-center text-gray-700 border-t border-gray-300 py-2 text-sm font-medium leading-snug bg-white">
          📍 123 Street, New York, USA &nbsp; | &nbsp; ✉️ info@example.com &nbsp; | &nbsp; 📞 +012 345 67890
        </div>
      </div>

      {/* Normal footer (only on screen) */}
      <footer className="bg-green-600 text-white p-2 relative z-10 print:hidden">
        <div className="px-6 flex flex-row text-center justify-center gap-6">
          <div className="px-10">
            <h2 className="text-sm font-semibold mb-3 px-10">Get In Touch</h2>
            <span className="mb-2 text-sm px-10">📍 123 Street, New York, USA</span>
            <span className="mb-2 text-sm px-10">✉️ info@example.com</span>
            <span className="text-sm px-10">📞 +012 345 67890</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default QuotationFooter;
