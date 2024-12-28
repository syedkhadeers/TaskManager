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
import { toast } from "react-toastify";
import "cropperjs/dist/cropper.css";

const MultiImageEditor = ({
  onImagesChange,
  maxImages = 10,
  initialImages = [],
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const cropperRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > maxImages) {
      toast.warning(`Maximum ${maxImages} images allowed`);
    }

    const validFiles = files
      .filter((file) => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File ${file.name} exceeds 5MB limit`);
          return false;
        }
        return true;
      })
      .slice(0, maxImages);

    if (validFiles.length > 0) {
      const imagePromises = validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setSelectedFiles(imagePromises);
      setCurrentImageIndex(0);
      setRotation(0);
      setShowModal(true);
    }
  };

  const [processedImages, setProcessedImages] = useState(
    initialImages.map((image) => ({
      preview: image.preview,
      cropped: image.preview,
      file: null,
    }))
  );


  const handleRotate = (angle) => {
    if (cropperRef.current?.cropper) {
      const currentRotation = rotation + angle;
      cropperRef.current.cropper.rotateTo(currentRotation);
      setRotation(currentRotation);
    }
  };

  const handleCropImage = () => {
    if (cropperRef.current?.cropper) {
      const canvas = cropperRef.current.cropper.getCroppedCanvas({
        maxWidth: 1024,
        maxHeight: 1024,
        fillColor: "#fff",
      });

      canvas.toBlob(
        (blob) => {
          const newProcessedImages = [...processedImages];
          newProcessedImages[currentImageIndex] = {
            file: selectedFiles[currentImageIndex].file,
            cropped: URL.createObjectURL(blob),
            preview: selectedFiles[currentImageIndex].preview,
          };
          setProcessedImages(newProcessedImages);

          if (currentImageIndex < selectedFiles.length - 1) {
            setCurrentImageIndex((prev) => prev + 1);
            setRotation(0);
          } else {
            onImagesChange(newProcessedImages);
            setShowModal(false);
          }
        },
        "image/jpeg",
        0.8
      );
    }
  };

  const handleNavigateImages = (direction) => {
    if (direction === "next" && currentImageIndex < selectedFiles.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
      setRotation(0);
    } else if (direction === "prev" && currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
      setRotation(0);
    }
  };

  const handleRemoveImage = (index) => {
    const newSelectedFiles = [...selectedFiles];
    const newProcessedImages = [...processedImages];

    newSelectedFiles.splice(index, 1);
    newProcessedImages.splice(index, 1);

    setSelectedFiles(newSelectedFiles);
    setProcessedImages(newProcessedImages);

    if (currentImageIndex >= newSelectedFiles.length) {
      setCurrentImageIndex(Math.max(0, newSelectedFiles.length - 1));
    }

    if (newSelectedFiles.length === 0) {
      setShowModal(false);
    }

    onImagesChange(newProcessedImages);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFiles([]);
    setCurrentImageIndex(0);
    setRotation(0);
  };

  return (
    <>
      <div className="w-full">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept="image/*"
          multiple
          className="hidden"
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
          <span className="text-lg font-medium">
            Upload Images (Max {maxImages})
          </span>
        </button>
      </div>

      {processedImages.length > 0 && (
        <div className="mt-4 grid grid-cols-5 gap-4">
          {processedImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image.cropped}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-3xl w-full mx-4 shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Edit Image ({currentImageIndex + 1}/{selectedFiles.length})
                </h3>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="flex justify-between items-center mb-4">
                <button
                  type="button"
                  onClick={() => handleNavigateImages("prev")}
                  disabled={currentImageIndex === 0}
                  className={`p-2 rounded ${
                    currentImageIndex === 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FiChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleRotate(-90)}
                    className="p-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    <FiRotateCcw className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRotate(90)}
                    className="p-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    <FiRotateCw className="w-6 h-6" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleNavigateImages("next")}
                  disabled={currentImageIndex === selectedFiles.length - 1}
                  className={`p-2 rounded ${
                    currentImageIndex === selectedFiles.length - 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FiChevronRight className="w-6 h-6" />
                </button>
              </div>

              <div className="max-h-[400px] overflow-hidden rounded-lg">
                <Cropper
                  ref={cropperRef}
                  src={selectedFiles[currentImageIndex]?.preview}
                  style={{ height: 400, width: "100%" }}
                  aspectRatio={16 / 9}
                  guides={true}
                  preview=".img-preview"
                  responsive={true}
                  viewMode={1}
                  background={false}
                  rotatable={true}
                  checkOrientation={false}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCropImage}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  {currentImageIndex === selectedFiles.length - 1
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

export default MultiImageEditor;
