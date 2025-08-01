"use client";
// QRPrintComponent.jsx
import React from "react";
import printJS from "print-js";

const PrintView = ({header, description, qrImage}) => {
  const handlePrint = () => {
    printJS({
      printable: "qr-print-section",
      type: "html",
      targetStyles: ["*"], // include all styles
    });
  };

  return (
    <div className="p-6">
      <button
        onClick={handlePrint}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Print QR Code
      </button>

      {/* Section to print */}
      <div
        id="qr-print-section"
        className="text-center p-6 flex border border-gray-200 shadow-md justify-center"
      >
        <div className="bg-white p-6">
            <h1 className="text-3xl font-bold mb-2">{header}</h1>
            <p className="text-lg text-gray-600 mb-6">
            {description}
            </p>
            <img
            src={qrImage}
            alt="QR Code"
            className="mx-auto w-48 h-48"
            />
        </div>
      </div>
    </div>
  );
};

export default PrintView;
