import React, { useRef, useState, useCallback } from "react";
import Cropper from "react-cropper";
import { useDropzone } from "react-dropzone";
import {
  FiX,
  FiUpload,
  FiRotateCcw,
  FiRotateCw,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import "cropperjs/dist/cropper.css";

const MultiImageEditor = ({
  onImagesChange,
  maxImages = 10,
  initialImages = [],
}) => {
  const [images, setImages] = useState(initialImages);
  const [currentImage, setCurrentImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(null);
  const [rotation, setRotation] = useState(0);
  const cropperRef = useRef(null);

  const aspectRatios = [
    { label: "1:1", value: 1 },
    { label: "16:9", value: 16 / 9 },
    { label: "Free", value: null },
  ];

  const onDrop = useCallback(
    (acceptedFiles) => {
      const newImages = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        cropped: null,
      }));

      setImages((prevImages) => {
        const updatedImages = [...prevImages, ...newImages].slice(0, maxImages);
        onImagesChange(updatedImages);
        return updatedImages;
      });
    },
    [maxImages, onImagesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true,
  });

  const removeImage = (index) => {
    setImages((prevImages) => {
      const updatedImages = prevImages.filter((_, i) => i !== index);
      onImagesChange(updatedImages);
      return updatedImages;
    });
  };

  const startEditing = (index) => {
    setCurrentImage(images[index]);
    setShowModal(true);
    setRotation(0);
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
          setImages((prevImages) => {
            const updatedImages = prevImages.map((img) =>
              img === currentImage ? { ...img, cropped: url } : img
            );
            onImagesChange(updatedImages);
            return updatedImages;
          });
          setShowModal(false);
          setCurrentImage(null);
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
    setCurrentImage(null);
    setRotation(0);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">
          Drag 'n' drop some images here, or click to select images
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image.cropped || image.preview}
              alt={`Uploaded ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => startEditing(index)}
                className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors mr-2"
              >
                <FiEdit2 size={20} />
              </button>
              <button
                onClick={() => removeImage(index)}
                className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {images.length < maxImages && (
        <button
          type="button"
          onClick={() => document.querySelector('input[type="file"]').click()}
          className="mt-4 flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiUpload className="w-5 h-5 mr-2" />
          Add more images
        </button>
      )}

      {showModal && currentImage && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-3xl w-full mx-4 shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Edit Image
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
                  style={{ maxHeight: "400px" }}
                  className="overflow-hidden rounded-lg"
                >
                  <Cropper
                    ref={cropperRef}
                    src={currentImage.preview}
                    style={{ height: "400px", width: "100%" }}
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
    </div>
  );
};

export default MultiImageEditor;
