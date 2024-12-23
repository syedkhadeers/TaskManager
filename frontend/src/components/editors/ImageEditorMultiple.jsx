import React, { useRef, useState } from "react";
import Cropper from "react-cropper";
import {
  FiX,
  FiUpload,
  FiRotateCcw,
  FiRotateCw,
  FiChevronLeft,
  FiChevronRight,
  FiTrash2,
} from "react-icons/fi";
import "cropperjs/dist/cropper.css";

const ImageEditorMultiple = ({
  onCropComplete,
  onCancel,
  aspectRatios = [
    { label: "1:1", value: 1 },
    { label: "16:9", value: 16 / 9 },
    { label: "Free", value: null },
  ],
  maxHeight = "400px",
  modalTitle = "Edit Images",
}) => {
  const [showModal, setShowModal] = useState(false);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [croppedImages, setCroppedImages] = useState([]);
  const cropperRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const imagePromises = files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagePromises).then((results) => {
        setImages(results);
        setShowModal(true);
        setCurrentImageIndex(0);
        setRotation(0);
        setCroppedImages([]);
      });
    }
  };

  const handleCropCurrent = () => {
    if (cropperRef.current?.cropper) {
      const canvas = cropperRef.current.cropper.getCroppedCanvas({
        maxWidth: 1024,
        maxHeight: 1024,
        fillColor: "#fff",
      });

      canvas.toBlob(
        (blob) => {
          const url = URL.createObjectURL(blob);
          setCroppedImages((prev) => {
            const newImages = [...prev];
            newImages[currentImageIndex] = url;
            return newImages;
          });

          if (currentImageIndex < images.length - 1) {
            setCurrentImageIndex((prev) => prev + 1);
            setRotation(0);
          } else {
            onCropComplete(croppedImages);
            setShowModal(false);
            setImages([]);
            setCroppedImages([]);
          }
        },
        "image/jpeg",
        0.8
      );
    }
  };

  const handleNavigateImages = (direction) => {
    if (direction === "next" && currentImageIndex < images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    } else if (direction === "prev" && currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
    setRotation(0);
  };

  const handleRemoveImage = () => {
    const newImages = images.filter((_, index) => index !== currentImageIndex);
    const newCroppedImages = croppedImages.filter(
      (_, index) => index !== currentImageIndex
    );

    setImages(newImages);
    setCroppedImages(newCroppedImages);

    if (newImages.length === 0) {
      setShowModal(false);
    } else {
      setCurrentImageIndex((prev) => (prev === 0 ? 0 : prev - 1));
    }
  };

  const handleCrop = () => {
    if (cropperRef.current?.cropper) {
      const canvas = cropperRef.current.cropper.getCroppedCanvas({
        maxWidth: 1024,
        maxHeight: 1024,
        fillColor: "#fff",
      });

      canvas.toBlob(
        (blob) => {
          const url = URL.createObjectURL(blob);
          onCropComplete(url);
          setShowModal(false);
          setImage(null);
        },
        "image/jpeg",
        0.8
      );
    }
  };

  const handleRotate = (angle) => {
    if (cropperRef.current?.cropper) {
      const currentRotation = cropperRef.current.cropper.getData().rotate || 0;
      const newRotation = currentRotation + angle;
      cropperRef.current.cropper.rotateTo(newRotation);
      setRotation(newRotation);
    }
  };

  const handleRotateSlider = (e) => {
    const newRotation = parseInt(e.target.value);
    if (cropperRef.current?.cropper) {
      cropperRef.current.cropper.rotateTo(newRotation);
      setRotation(newRotation);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setImage(null);
    setRotation(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onCancel?.();
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* Upload Button */}
      <div className="w-full">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          multiple
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl
                   bg-gray-50 hover:bg-gray-100 hover:border-blue-500 
                   transition-all duration-300 ease-in-out
                   flex items-center justify-center gap-3 
                   text-gray-600 hover:text-blue-500
                   shadow-sm hover:shadow-md"
        >
          <FiUpload className="w-6 h-6" />
          <span className="text-lg font-medium">Upload Images</span>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-3xl w-full mx-4 shadow-2xl">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {`${modalTitle} (${currentImageIndex + 1}/${images.length})`}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => handleNavigateImages("prev")}
                  disabled={currentImageIndex === 0}
                  className={`p-2 rounded ${
                    currentImageIndex === 0
                      ? "text-gray-400"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FiChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={handleRemoveImage}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                >
                  <FiTrash2 className="w-6 h-6" />
                </button>

                <button
                  onClick={() => handleNavigateImages("next")}
                  disabled={currentImageIndex === images.length - 1}
                  className={`p-2 rounded ${
                    currentImageIndex === images.length - 1
                      ? "text-gray-400"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FiChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Cropper */}
              <div style={{ maxHeight }} className="overflow-hidden rounded-lg">
                <Cropper
                  ref={cropperRef}
                  src={images[currentImageIndex]}
                  style={{ height: maxHeight, width: "100%" }}
                  aspectRatio={aspectRatio}
                  guides={true}
                  preview=".img-preview"
                  responsive={true}
                  viewMode={1}
                  background={false}
                  rotatable={true}
                  checkOrientation={false}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropCurrent}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {currentImageIndex === images.length - 1
                    ? "Finish"
                    : "Next Image"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageEditorMultiple;