import React, { useRef, useState } from "react";
import Cropper from "react-cropper";
import { FiX, FiUpload, FiRotateCcw, FiRotateCw } from "react-icons/fi";
import "cropperjs/dist/cropper.css";

const ImageEditor = ({
  onCropComplete,
  onCancel,
  aspectRatios = [
    { label: "1:1", value: 1 },
    { label: "16:9", value: 16 / 9 },
    { label: "Free", value: null },
  ],
  maxHeight = "400px",
  modalTitle = "Edit Image",
}) => {
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(null);
  const [rotation, setRotation] = useState(0);
  const cropperRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setShowModal(true);
        setRotation(0);
      };
      reader.readAsDataURL(file);
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
      <div className="w-full">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <button
          type="button"
          onClick={handleTriggerUpload}
          className="w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl
                   bg-gray-50 hover:bg-gray-100 hover:border-blue-500 
                   transition-all duration-300 ease-in-out
                   flex items-center justify-center gap-3 
                   text-gray-600 hover:text-blue-500
                   shadow-sm hover:shadow-md"
        >
          <FiUpload className="w-6 h-6" />
          <span className="text-lg font-medium">Upload Image</span>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-3xl w-full mx-4 shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {modalTitle}
                </h3>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="p-2 text-gray-500 hover:text-gray-700 
                           rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {aspectRatios.map((ratio) => (
                    <button
                      key={ratio.label}
                      type="button"
                      onClick={() => setAspectRatio(ratio.value)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200
                        ${
                          aspectRatio === ratio.value
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                        }`}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleRotate(-90)}
                      className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 
                               text-gray-700 transition-all duration-200"
                    >
                      <FiRotateCcw className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={rotation}
                        onChange={handleRotateSlider}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none 
                                 cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>-180°</span>
                        <span>{rotation}°</span>
                        <span>180°</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRotate(90)}
                      className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 
                               text-gray-700 transition-all duration-200"
                    >
                      <FiRotateCw className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div
                  style={{ maxHeight }}
                  className="overflow-hidden rounded-lg"
                >
                  <Cropper
                    ref={cropperRef}
                    src={image}
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
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2.5 rounded-lg bg-gray-100 text-gray-700 
                           font-medium hover:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCrop}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 text-white 
                           font-medium hover:bg-blue-700 transition-all duration-200
                           shadow-md hover:shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageEditor;
