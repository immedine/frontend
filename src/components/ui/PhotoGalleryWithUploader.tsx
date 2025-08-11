import { X } from 'lucide-react';
import React, { useRef } from 'react';
import { toast } from 'sonner';

export default function ImageGalleryUploader({images, setImages, parentFiles, setFiles}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));

    if (((images.length || 0) + newImages.length) > 5) {
      toast.error("You can only upload up to 5 images.");
      return;
    }
    setImages(prev => [ ...newImages, ...prev]);

    let localParentFiles = parentFiles;
    for (const item in e.target.files) {
      localParentFiles.push(e.target.files[item]);
    }
    setFiles(localParentFiles);
  };

  const openFileDialog = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center gap-3">
        {/* Plus Button */}
        <button
          type='button'
          onClick={openFileDialog}
          className="w-[70px] h-[70px] flex items-center justify-center border border-dashed border-gray-400 rounded bg-gray-100 hover:bg-gray-200 text-2xl"
        >
          +
        </button>

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />

        {/* Uploaded Images */}
        <div className="flex gap-3 overflow-x-auto relative">
          {images.map((src, index) => (
            <div key={index} className="relative">
              <button
                type="button"
                onClick={() => {
                  console.log("src ", src)
                  if (src.includes('blob:')) {
                    setFiles(prev => prev.filter((file) => {
                      if (file instanceof File && URL.createObjectURL(file) === src) {
                        return false;
                      }
                    }));
                  }
                  setImages(prev => prev.filter((_, i) => i !== index));
                }}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              >
                <X size={16} />
              </button>
            <img
              key={index}
              src={src}
              alt={`img-${index}`}
              className="w-[70px] h-[70px] object-cover rounded shadow"
            />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
