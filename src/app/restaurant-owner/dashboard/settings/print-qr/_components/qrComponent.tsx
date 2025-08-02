"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import PrintView from "./PreviewPrint";

export default function QRCodeForm() {
  const [header, setHeader] = useState("");
  const [description, setDescription] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [preview, setPreview] = useState(false)

  const generateQRCode = async () => {
    try {
      const url = await QRCode.toDataURL("https://fb.com");
      setQrImage(url);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    generateQRCode();
  }, []);

  return (
    !preview ? <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">Print QR Code</h2>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Header</label>
          <input
            type="text"
            value={header}
            onChange={(e) => setHeader(e.target.value)}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter header"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter description"
          />
        </div>

        {qrImage && (
          <div className="text-center my-4">
            <img src={qrImage} alt="QR Code" className="mx-auto w-40 h-40" />
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={() => setPreview(true)}
            className="w-24 bg-primary text-white py-2 rounded-md transition"
          >
            Preview
          </button>
        </div>
        
      </div>
    </div> : <PrintView 
      header={header}
      description={description}
      qrImage={qrImage}
      setPreview={setPreview}
    />
  );
}
