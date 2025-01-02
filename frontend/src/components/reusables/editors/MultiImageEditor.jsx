import React, { useRef, useState } from "react";
import Cropper from "react-cropper";
import {
  FiX,
  FiUpload,
  FiRotateCcw,
  FiRotateCw,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "cropperjs/dist/cropper.css";

const ASPECT_RATIO_OPTIONS = {
  FREE: 0,
  PROFILE: 1,
  PRODUCT_H: 16 / 9,
  PRODUCT_V: 9 / 16,
  LOGO_BIG: 3 / 1,
};

const MultiImageEditor = ({
  onImagesChange,
  maxImages = 10,
  initialImages = [],
  arrange = true,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState(
    ASPECT_RATIO_OPTIONS.FREE
  );
  const cropperRef = useRef(null);
  const fileInputRef = useRef(null);
  const [processedImages, setProcessedImages] = useState(
    initialImages.map((image) => ({
      preview: image.preview,
      cropped: image.preview,
      file: null,
    }))
  );
  const [draggedImageIndex, setDraggedImageIndex] = useState(null);

  const handleImageDragStart = (e, index) => {
    setDraggedImageIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleImageDragOver = (e, index) => {
    e.preventDefault();
    if (draggedImageIndex === null || draggedImageIndex === index) return;

    const newImages = [...processedImages];
    const draggedImage = newImages[draggedImageIndex];
    newImages.splice(draggedImageIndex, 1);
    newImages.splice(index, 0, draggedImage);

    setProcessedImages(newImages);
    setDraggedImageIndex(index);
    onImagesChange(newImages);
  };

  const handleImageDragEnd = () => {
    setDraggedImageIndex(null);
  };


  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const currentImageCount = processedImages.length;
    const remainingSlots = maxImages - currentImageCount;

    if (remainingSlots <= 0) {
      toast.error(`Maximum ${maxImages} images are already selected`);
      e.target.value = null;
      return;
    }

    if (files.length > remainingSlots) {
      toast.warning(
        `You can only add ${remainingSlots} more image${
          remainingSlots > 1 ? "s" : ""
        }. ${maxImages} images maximum.`
      );
    }

    const validFiles = files
      .filter((file) => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File ${file.name} exceeds 5MB limit`);
          return false;
        }
        return true;
      })
      .slice(0, remainingSlots);

    if (validFiles.length > 0) {
      const imagePromises = validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setSelectedFiles(imagePromises);
      setCurrentImageIndex(0);
      setRotation(0);
      setSelectedAspectRatio(ASPECT_RATIO_OPTIONS.FREE);
      setShowModal(true);
    }

    e.target.value = null;
  };

  const handleAspectRatioChange = (newRatio) => {
    setSelectedAspectRatio(newRatio);
    if (cropperRef.current?.cropper) {
      cropperRef.current.cropper.setAspectRatio(
        newRatio === ASPECT_RATIO_OPTIONS.FREE ? NaN : newRatio
      );
      cropperRef.current.cropper.clear();
      cropperRef.current.cropper.crop();
    }
  };

  const handleRotate = (angle) => {
    if (cropperRef.current?.cropper) {
      const currentRotation = rotation + angle;
      cropperRef.current.cropper.rotateTo(currentRotation);
      setRotation(currentRotation);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFiles([]);
    setCurrentImageIndex(0);
    setRotation(0);
    setSelectedAspectRatio(ASPECT_RATIO_OPTIONS.FREE);
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
          const newProcessedImage = {
            file: selectedFiles[currentImageIndex].file,
            cropped: URL.createObjectURL(blob),
            preview: selectedFiles[currentImageIndex].preview,
          };

          setProcessedImages((prev) => [...prev, newProcessedImage]);

          if (currentImageIndex < selectedFiles.length - 1) {
            setCurrentImageIndex((prev) => prev + 1);
            setRotation(0);
          } else {
            onImagesChange([...processedImages, newProcessedImage]);
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
    const newProcessedImages = [...processedImages];
    newProcessedImages.splice(index, 1);
    setProcessedImages(newProcessedImages);
    onImagesChange(newProcessedImages);
  };

  const AspectRatioButton = ({ ratio, label, value }) => (
    <button
      type="button"
      onClick={() => handleAspectRatioChange(value)}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
        selectedAspectRatio === value
          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
          : "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-blue-400 hover:text-blue-500"
      }`}
    >
      {label}
    </button>
  );

  const AspectRatioSelector = () => (
    <div className="flex flex-wrap gap-3 mb-6">
      <AspectRatioButton
        ratio="free"
        label="Free"
        value={ASPECT_RATIO_OPTIONS.FREE}
      />
      <AspectRatioButton
        ratio="1:1"
        label="Profile"
        value={ASPECT_RATIO_OPTIONS.PROFILE}
      />
      <AspectRatioButton
        ratio="16:9"
        label="Product H"
        value={ASPECT_RATIO_OPTIONS.PRODUCT_H}
      />
      <AspectRatioButton
        ratio="9:16"
        label="Product V"
        value={ASPECT_RATIO_OPTIONS.PRODUCT_V}
      />
      <AspectRatioButton
        ratio="3:1"
        label="Logo Big"
        value={ASPECT_RATIO_OPTIONS.LOGO_BIG}
      />
    </div>
  );

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
          disabled={processedImages.length >= maxImages}
          className={`w-full px-8 py-6 border-3 border-dashed rounded-lg 
            ${
              processedImages.length >= maxImages
                ? "border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700"
            }
            transition-all duration-300 ease-out flex items-center justify-center gap-4 group`}
        >
          <div
            className={`w-12 h-12 rounded-xl ${
              processedImages.length >= maxImages
                ? "bg-gray-200 dark:bg-gray-700"
                : "bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-500"
            } flex items-center justify-center transition-colors duration-300`}
          >
            <FiUpload
              className={`w-6 h-6 ${
                processedImages.length >= maxImages
                  ? "text-gray-400 dark:text-gray-500"
                  : "text-blue-500 dark:text-blue-400 group-hover:text-white"
              }`}
            />
          </div>
          <div className="flex flex-col items-start">
            <span
              className={`text-xl font-semibold ${
                processedImages.length >= maxImages
                  ? "text-gray-400 dark:text-gray-500"
                  : "text-gray-700 dark:text-gray-200 group-hover:text-blue-500"
              }`}
            >
              {processedImages.length >= maxImages
                ? "Maximum Images Reached"
                : "Select Images to Upload"}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {processedImages.length} of {maxImages} images used
            </span>
          </div>
        </button>
      </div>

      {/* Image preview grid */}
      {processedImages.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {processedImages.map((image, index) => (
            <div
              key={index}
              draggable={arrange}
              onDragStart={(e) => handleImageDragStart(e, index)}
              onDragOver={(e) => handleImageDragOver(e, index)}
              onDragEnd={handleImageDragEnd}
              className={`relative group rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${
                arrange ? "cursor-move" : ""
              } ${draggedImageIndex === index ? "opacity-50" : "opacity-100"}`}
            >
              {arrange && (
                <div className="absolute top-2 left-2 z-10 w-6 h-6 flex items-center justify-center bg-black/70 rounded-full text-white text-sm font-medium">
                  {index + 1}
                </div>
              )}
              <img
                src={image.cropped}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 p-2 bg-red-500 rounded-lg text-white
                         opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0
                         transition-all duration-300 hover:bg-red-600"
              >
                <FiX size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full mx-4 shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Edit Image ({currentImageIndex + 1}/{selectedFiles.length})
                </h3>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors dark:hover:bg-gray-700"
                >
                  <FiX className="w-6 h-6 text-gray-900 dark:text-gray-100" />
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

              <div className="max-h-[500px] overflow-hidden rounded-lg p-4">
                <AspectRatioSelector />
                <Cropper
                  ref={cropperRef}
                  src={selectedFiles[currentImageIndex]?.preview}
                  style={{ width: "100%", maxHeight: "400px" }}
                  aspectRatio={
                    selectedAspectRatio === ASPECT_RATIO_OPTIONS.FREE
                      ? NaN
                      : selectedAspectRatio
                  }
                  guides={true}
                  preview=".img-preview"
                  responsive={true}
                  viewMode={1}
                  background={true}
                  rotatable={true}
                  checkOrientation={false}
                  zoomable={true}
                  movable={true}
                  autoCropArea={0.9}
                  restore={false}
                  modal={true}
                  center={true}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  dragMode="crop"
                  initialAspectRatio={1}
                  cropBoxResizable={true}
                  className="cropper-container-wrapper"
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
