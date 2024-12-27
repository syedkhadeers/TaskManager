import React, { useRef, useState } from "react";
import Cropper from "react-cropper";
import { FiX, FiUpload, FiRotateCcw, FiRotateCw } from "react-icons/fi";
import { toast } from "react-toastify";
import "cropperjs/dist/cropper.css";

const ASPECT_RATIO_OPTIONS = {
  FREE: 0,
  PROFILE: 1,
  PRODUCT_H: 16 / 9,
  PRODUCT_V: 9 / 16,
  LOGO_BIG: 3 / 1,
};

const SingleImageEditor = ({ onImagesChange, initialImage = null }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState(
    ASPECT_RATIO_OPTIONS.FREE
  );
  const cropperRef = useRef(null);
  const fileInputRef = useRef(null);
  const [processedImage, setProcessedImage] = useState(
    initialImage
      ? {
          preview: initialImage.preview,
          cropped: initialImage.preview,
          file: null,
        }
      : null
  );

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File exceeds 5MB limit");
      e.target.value = null;
      return;
    }

    setSelectedFile({
      file,
      preview: URL.createObjectURL(file),
    });
    setRotation(0);
    setSelectedAspectRatio(ASPECT_RATIO_OPTIONS.FREE);
    setShowModal(true);
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

  const handleCropImage = () => {
    if (cropperRef.current?.cropper) {
      const canvas = cropperRef.current.cropper.getCroppedCanvas({
        maxWidth: 1024,
        maxHeight: 1024,
        fillColor: "#fff",
      });``

      canvas.toBlob(
        (blob) => {
          const newProcessedImage = {
            file: selectedFile.file,
            cropped: URL.createObjectURL(blob),
            preview: selectedFile.preview,
          };

          setProcessedImage(newProcessedImage);
          if (onImagesChange) {
            // Add a check for the prop
            onImagesChange([newProcessedImage]);
          }
          setShowModal(false);
        },
        "image/jpeg",
        0.8
      );
    }
  };

  // In SingleImageEditor.jsx
const handleRemoveImage = () => {
  setProcessedImage(null);
  if (onImagesChange) {
    // Add a check for the prop
    onImagesChange([]);
  }
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
      {!processedImage ? (
        <div className="w-full">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 border-2 border-dashed border-primary-light dark:border-primary-dark rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-xl hover:border-primary-dark dark:hover:border-primary-light transition-all duration-300 ease-out group"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="p-4 rounded-full bg-primary-50 dark:bg-primary-900 group-hover:scale-110 transition-transform duration-300">
                <FiUpload className="w-8 h-8 text-primary-dark dark:text-primary-light" />
              </div>
              <span className="text-lg font-medium text-gray-600 dark:text-gray-300 group-hover:text-primary-dark dark:group-hover:text-primary-light">
                Click to Upload Image
              </span>
            </div>
          </button>
        </div>
      ) : (
        <div className="relative group">
          <div className="w-48 h-48 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
            <img
              src={processedImage.cropped}
              alt="Preview"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div className="absolute top-4 left-4 flex space-x-2">
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-3 bg-red-500/90 hover:bg-red-500 text-white rounded-full transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                  title="Remove Photo"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full mx-4 shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Edit Image
                </h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <FiX className="w-6 h-6 text-gray-900 dark:text-gray-100" />
                </button>
              </div>

              <div className="flex justify-center items-center mb-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleRotate(-90)}
                    className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <FiRotateCcw className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRotate(90)}
                    className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <FiRotateCw className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="max-h-[500px] overflow-hidden rounded-lg">
                <AspectRatioSelector />
                <Cropper
                  ref={cropperRef}
                  src={selectedFile?.preview}
                  style={{ width: "100%", maxHeight: "400px" }}
                  aspectRatio={
                    selectedAspectRatio === ASPECT_RATIO_OPTIONS.FREE
                      ? NaN
                      : selectedAspectRatio
                  }
                  guides={true}
                  responsive={true}
                  viewMode={1}
                  background={true}
                  rotatable={true}
                  checkOrientation={false}
                  autoCropArea={0.9}
                  className="cropper-container-wrapper"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCropImage}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Save Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleImageEditor;
