//CustomCropAspectMultiple

import React, { useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import { BiCloudUpload } from "react-icons/bi";
import { FaUndo, FaTrash } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import {
  AiOutlineZoomIn,
  AiOutlineZoomOut,
  AiOutlineRotateLeft,
  AiOutlineRotateRight,
} from "react-icons/ai";
import { GoShieldLock } from "react-icons/go";

const CustomCropAspectMultiple = () => {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImages, setCroppedImages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(4 / 3);
  const [customAspectRatio, setCustomAspectRatio] = useState({
    width: 4,
    height: 3,
  });
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImages).then((loadedImages) => {
      setImages((prev) => [...prev, ...loadedImages]);
      setCurrentImageIndex(images.length);
      setModalOpen(true);
    });
  };

  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);

    const calculatedAspectRatio =
      croppedAreaPixels.width / croppedAreaPixels.height;

    setCustomAspectRatio({
      width: Math.round(calculatedAspectRatio * 100),
      height: 100,
    });
    setAspectRatio(calculatedAspectRatio);
  }, []);

  const createCroppedImage = useCallback(
    async (imageUrl) => {
      if (!croppedAreaPixels || !imageUrl) return;

      const canvas = document.createElement("canvas");
      const img = new Image();
      img.src = imageUrl;

      return new Promise((resolve) => {
        img.onload = () => {
          canvas.width = croppedAreaPixels.width;
          canvas.height = croppedAreaPixels.height;

          const ctx = canvas.getContext("2d");
          ctx.translate(
            croppedAreaPixels.width / 2,
            croppedAreaPixels.height / 2
          );
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.drawImage(
            img,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            -croppedAreaPixels.width / 2,
            -croppedAreaPixels.height / 2,
            croppedAreaPixels.width,
            croppedAreaPixels.height
          );

          const croppedImageUrl = canvas.toDataURL("image/jpeg");
          resolve(croppedImageUrl);
        };
      });
    },
    [croppedAreaPixels, rotation]
  );

  const handleSave = async () => {
    const croppedImg = await createCroppedImage(images[currentImageIndex]);
    setCroppedImages((prev) => {
      const newCroppedImages = [...prev];
      newCroppedImages[currentImageIndex] = croppedImg;
      return newCroppedImages;
    });

    // Move to next image or close modal
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
      resetCrop();
    } else {
      setModalOpen(false);
    }
  };

  const resetCrop = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setAspectRatio(4 / 3);
    setCustomAspectRatio({ width: 4, height: 3 });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setCroppedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAspectRatioChange = (e) => {
    const value = Number(e.target.value);
    setAspectRatio(value);

    const aspectRatioMap = {
      [4 / 3]: { width: 4, height: 3 },
      [16 / 9]: { width: 16, height: 9 },
      [1]: { width: 1, height: 1 },
      [3 / 4]: { width: 3, height: 4 },
      [5 / 4]: { width: 5, height: 4 },
      [2 / 1]: { width: 2, height: 1 },
      [9 / 16]: { width: 9, height: 16 },
    };

    setCustomAspectRatio(aspectRatioMap[value] || { width: 4, height: 3 });
  };

  return (
    <div className="items-center justify-center">
      <div className="w-full bg-gray-100 p-6 rounded-lg shadow-md mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Custom Crop Aspects
        </label>
        <div
          onClick={() => fileInputRef.current.click()}
          className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer hover:border-blue-400 transition-all mt-4"
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            multiple
            className="hidden"
          />
          <div className="flex flex-col items-center">
            <div className="bg-gray-200 p-4 rounded-full mb-2">
              <BiCloudUpload className="text-4xl text-blue-500" />
            </div>
            <p className="text-gray-500 font-medium">Drag & Drop</p>
            <p className="text-gray-600 text-sm">
              or{" "}
              <span className="text-blue-600 underline cursor-pointer">
                browse
              </span>
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Supports: JPG, JPEG, PNG
            </p>
          </div>
          <div className="flex items-center justify-between mt-5 px-2 bottom-0">
            <p className="text-gray-400 text-xs">Max Size: 2MB</p>
            <p className="text-gray-400 text-xs flex items-center">
              <GoShieldLock /> {"    "}
              Secured
            </p>
          </div>
        </div>

        {/* Cropped Images Preview */}
        {croppedImages.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            {croppedImages.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img}
                  alt={`Cropped ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg shadow-lg"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-gray-500 p-1 rounded-full"
                >
                  <FaTrash className="text-white text-sm" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Crop Modal */}
      {modalOpen && currentImageIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg">
            {" "}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Crop Image {currentImageIndex + 1} of {images.length}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <AiOutlineClose />
              </button>
            </div>
            {images[currentImageIndex] && (
              <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                <Cropper
                  image={images[currentImageIndex]}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={aspectRatio}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                />
              </div>
            )}
            {/* Zoom Slider */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Zoom: {Math.round((zoom - 1) * 100)}%
              </label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            {/* Rotation Slider */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Rotation: {rotation}°
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <select
                  value={aspectRatio}
                  onChange={handleAspectRatioChange}
                  className="border rounded p-2"
                >
                  <option value={4 / 3}>4:3</option>
                  <option value={16 / 9}>16:9</option>
                  <option value={1}>1:1</option>
                  <option value={3 / 4}>3:4</option>
                  <option value={5 / 4}>5:4</option>
                  <option value={2 / 1}>2:1</option>
                  <option value={9 / 16}>9:16</option>
                </select>
                <span className="text-gray-500">
                  {customAspectRatio.width}:{customAspectRatio.height}
                </span>
              </div>
              <button
                onClick={resetCrop}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <FaUndo className="mr-1" /> Reset
              </button>
            </div>
            <button
              onClick={handleSave}
              className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCropAspectMultiple;