"use client";
// QRPrintComponent.jsx
import React from "react";
import printJS from "print-js";

const PrintView = ({header, description, qrImage, setPreview}) => {
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
        onClick={() => setPreview(false)}
        className="mb-4 mr-4 px-4 py-2 bg-gray-200 text-gray-800 rounded"
      >
        Back
      </button>
      <button
        onClick={handlePrint}
        className="mb-4 px-4 py-2 bg-primary text-white rounded"
      >
        Print QR Code
      </button>

      {/* Section to print */}
      <div
        id="qr-print-section"
        className="text-center p-6 flex border border-gray-200 shadow-md justify-center print:w-screen print:h-screen"
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
            <p className="text-md"><span className="text-xs">Sponsored by: </span><b>ImmeDine</b></p>
        </div>
      </div>
    </div>
  );
};

export default PrintView;
