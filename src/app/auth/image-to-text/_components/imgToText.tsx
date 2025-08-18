'use client';

import { useEffect, useState } from 'react';
import { createWorker } from "tesseract.js"

export default function ImgToText() {

  const [ocr, setOcr] = useState("");
  const [imageData, setImageData] = useState(null);
  const worker = createWorker();
  const convertImageToText = async () => {
    console.log("worker ", worker)
    if (!imageData) return;
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    await worker.setParameters({
      tessedit_char_whitelist: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ "
    });
    const {data} = await worker.recognize(imageData);
    console.log("data ", data)

    // const maxValue = Math.max(...data.words.map(obj => obj.font_size));

    // console.log(maxValue);

    // const categories = [];

    // data.words.forEach(each => {
    //   if (each.font_size === maxValue) {
    //     each.text.length > 1 && categories.push(each.text);
    //   }
    // });

    // console.log("categories ", categories)


    setOcr(data.text);
  };

  useEffect(() => {
    imageData && convertImageToText();
  }, [imageData]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if(!file)return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUri = reader.result;
      console.log({ imageDataUri });
      setImageData(imageDataUri);
    };
    reader.readAsDataURL(file);
  }


  return (
    <>
      <div>
        <p>Choose an Image</p>
        <input
          type="file"
          name=""
          id=""
          onChange={handleImageChange}
          accept="image/*"
        />
      </div>
      {imageData ?
      <div className="display-flex">
        <img src={imageData} alt="" width={200} height={200} />
        <p>{ocr}</p>
      </div> : null}
    </>
  );
}
