import React, { useState, useRef, useCallback, useEffect } from "react";
import { BiCloudUpload } from "react-icons/bi";
import {
  FaUndo,
  FaCrop,
  FaFilter,
  FaPalette,
  FaSave,
  FaImage,
  FaFont,
  FaShapes,
  FaDrawPolygon,
} from "react-icons/fa";
import {
  AiOutlineClose,
  AiOutlineZoomIn,
  AiOutlineZoomOut,
  AiOutlineRotateLeft,
  AiOutlineRotateRight,
} from "react-icons/ai";
import { GoShieldLock } from "react-icons/go";

const CustomCropAspect = () => {
  const [image, setImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("crop");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isCropping, setIsCropping] = useState(false);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setOriginalImage(e.target.result);
        setModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const initializeCanvas = useCallback(() => {
    if (canvasRef.current && containerRef.current && image) {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        const containerAspectRatio =
          container.offsetWidth / container.offsetHeight;
        const imageAspectRatio = img.width / img.height;
        let newWidth, newHeight;

        if (imageAspectRatio > containerAspectRatio) {
          newWidth = container.offsetWidth;
          newHeight = newWidth / imageAspectRatio;
        } else {
          newHeight = container.offsetHeight;
          newWidth = newHeight * imageAspectRatio;
        }

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        imageRef.current = img;
        setCropArea({ x: 0, y: 0, width: newWidth, height: newHeight });
        applyChanges();
      };
      img.src = image;
    }
  }, [image]);

  useEffect(() => {
    if (modalOpen && image) {
      initializeCanvas();
    }
  }, [modalOpen, image, initializeCanvas]);

  const applyChanges = useCallback(() => {
    if (canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoomLevel, zoomLevel);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${
        selectedFilter || ""
      }`;

      ctx.drawImage(
        imageRef.current,
        0,
        0,
        imageRef.current.width,
        imageRef.current.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.restore();

      if (isCropping) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 2;
        ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
      }

      updatePreview();
    }
  }, [
    brightness,
    contrast,
    saturation,
    selectedFilter,
    rotation,
    zoomLevel,
    cropArea,
    isCropping,
  ]);

  const updatePreview = useCallback(() => {
    if (canvasRef.current && previewCanvasRef.current) {
      const sourceCanvas = canvasRef.current;
      const previewCanvas = previewCanvasRef.current;
      const previewCtx = previewCanvas.getContext("2d");

      let sourceX = cropArea.x;
      let sourceY = cropArea.y;
      let sourceWidth = cropArea.width;
      let sourceHeight = cropArea.height;

      if (sourceWidth === 0 || sourceHeight === 0) {
        sourceX = 0;
        sourceY = 0;
        sourceWidth = sourceCanvas.width;
        sourceHeight = sourceCanvas.height;
      }

      const aspectRatio = sourceWidth / sourceHeight;
      let previewWidth, previewHeight;

      if (aspectRatio > 1) {
        previewWidth = previewCanvas.width;
        previewHeight = previewWidth / aspectRatio;
      } else {
        previewHeight = previewCanvas.height;
        previewWidth = previewHeight * aspectRatio;
      }

      previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
      previewCtx.drawImage(
        sourceCanvas,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        (previewCanvas.width - previewWidth) / 2,
        (previewCanvas.height - previewHeight) / 2,
        previewWidth,
        previewHeight
      );

      setEditedImage(previewCanvas.toDataURL("image/png"));
    }
  }, [cropArea]);

  useEffect(() => {
    applyChanges();
  }, [applyChanges]);

  const handleSave = () => {
    setModalOpen(false);
  };

  const resetChanges = () => {
    setZoomLevel(1);
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setSelectedFilter(null);
    setCropArea({
      x: 0,
      y: 0,
      width: canvasRef.current.width,
      height: canvasRef.current.height,
    });
    setIsCropping(false);
    initializeCanvas();
  };

  const handleCropStart = (e) => {
    if (activeTab === "crop" && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const startX = (e.clientX - rect.left) * scaleX;
      const startY = (e.clientY - rect.top) * scaleY;
      setCropArea({ x: startX, y: startY, width: 0, height: 0 });
      setIsCropping(true);
    }
  };

  const handleCropMove = (e) => {
    if (isCropping && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const currentX = (e.clientX - rect.left) * scaleX;
      const currentY = (e.clientY - rect.top) * scaleY;
      setCropArea((prev) => ({
        ...prev,
        width: Math.max(0, currentX - prev.x),
        height: Math.max(0, currentY - prev.y),
      }));
      applyChanges();
    }
  };

  const handleCropEnd = () => {
    if (isCropping) {
      setIsCropping(false);
      applyChanges();
    }
  };

  const renderEditTabs = () => {
    const tabs = [
      { id: "crop", icon: FaCrop, label: "Crop" },
      { id: "filter", icon: FaFilter, label: "Filter" },
      { id: "adjust", icon: FaPalette, label: "Adjust" },
      { id: "draw", icon: FaDrawPolygon, label: "Draw" },
      { id: "text", icon: FaFont, label: "Text" },
      { id: "sticker", icon: FaImage, label: "Sticker" },
      { id: "shapes", icon: FaShapes, label: "Shapes" },
    ];

    return (
      <div className="flex justify-around border-b mb-4">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`py-2 px-4 flex flex-col items-center transition-all duration-300 ${
              activeTab === id
                ? "border-b-2 border-blue-500 text-blue-500 scale-105"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-t-lg"
            }`}
          >
            <Icon className="text-xl mb-1" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "crop":
        return (
          <div className="space-y-4">
            <div className="flex justify-between">
              {["Freeform", "1:1", "4:3", "16:9"].map((aspect) => (
                <button
                  key={aspect}
                  className="px-3 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors duration-300"
                >
                  {aspect}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-200">
              Click and drag on the image to crop
            </p>
          </div>
        );
      case "filter":
        return (
          <div className="grid grid-cols-3 gap-4">
            {[
              "Original",
              "Grayscale",
              "Sepia",
              "Invert",
              "Blur",
              "Sharpen",
            ].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setSelectedFilter(
                    filter === "Original"
                      ? null
                      : `${filter.toLowerCase()}(100%)`
                  );
                  applyChanges();
                }}
                className={`p-2 border rounded transition-all duration-300 ${
                  selectedFilter === `${filter.toLowerCase()}(100%)` ||
                  (filter === "Original" && !selectedFilter)
                    ? "border-blue-500 bg-blue-500 bg-opacity-20 scale-105"
                    : "border-gray-300 hover:bg-white hover:bg-opacity-10"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        );
      case "adjust":
        return (
          <div className="space-y-4">
            {[
              {
                label: "Brightness",
                value: brightness,
                setValue: setBrightness,
              },
              { label: "Contrast", value: contrast, setValue: setContrast },
              {
                label: "Saturation",
                value: saturation,
                setValue: setSaturation,
              },
            ].map(({ label, value, setValue }) => (
              <div key={label}>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  {label}: {value}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={value}
                  onChange={(e) => {
                    setValue(Number(e.target.value));
                    applyChanges();
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            ))}
          </div>
        );
      case "draw":
      case "text":
      case "sticker":
      case "shapes":
        return (
          <div className="text-center py-4">
            <p className="text-gray-200">
              This feature is not implemented in this demo.
            </p>
            <p className="text-gray-300 text-sm mt-2">
              In a full implementation, it would include tools for {activeTab}.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-gradient-to-br from-blue-400 to-indigo-600 p-6 rounded-lg shadow-lg">
        <label className="block text-2xl font-bold text-white mb-6">
          Advanced Image Editor
        </label>
        <div
          onClick={() => fileInputRef.current.click()}
          className="border-2 border-dashed border-white border-opacity-50 p-8 rounded-lg text-center cursor-pointer hover:border-opacity-100 transition-all duration-300 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg"
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center">
            <div className="bg-white bg-opacity-20 p-6 rounded-full mb-6 transform transition-transform duration-300 hover:scale-110">
              <BiCloudUpload className="text-6xl text-white" />
            </div>
            <p className="text-white font-semibold text-xl mb-2">Drag & Drop</p>
            <p className="text-gray-100 text-base mb-4">
              or{" "}
              <span className="text-white underline cursor-pointer hover:text-gray-200 transition-colors duration-300">
                browse
              </span>
            </p>
            <p className="text-gray-200 text-sm">Supports: JPG, JPEG, PNG</p>
          </div>
          <div className="flex items-center justify-between mt-8 px-2">
            <p className="text-gray-200 text-xs">Max Size: 2MB</p>
            <p className="text-gray-200 text-xs flex items-center">
              <GoShieldLock className="mr-1" /> Secured
            </p>
          </div>
        </div>

        {editedImage && (
          <div className="mt-8 relative">
            <img
              src={editedImage}
              alt="Edited"
              className="w-full max-h-64 object-contain rounded-lg"
            />
            <button
              onClick={() => setEditedImage(null)}
              className="absolute top-2 right-2 bg-white bg-opacity-20 rounded-full p-2 hover:bg-opacity-30 transition-colors duration-300"
            >
              <AiOutlineClose className="text-white" />
            </button>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4">
          <div className="bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col overflow-hidden backdrop-filter backdrop-blur-lg bg-opacity-80">
            <div className="flex justify-between items-center p-6 border-b border-white border-opacity-20">
              <h3 className="text-2xl font-bold text-white">Edit Image</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white hover:text-gray-200 transition-colors duration-300"
              >
                <AiOutlineClose className="text-2xl" />
              </button>
            </div>

            <div className="flex-grow flex flex-col overflow-hidden">
              <div className="flex flex-grow overflow-hidden">
                <div
                  ref={containerRef}
                  className="w-1/2 p-6 flex items-center justify-center bg-black bg-opacity-30 overflow-auto"
                >
                  <canvas
                    ref={canvasRef}
                    className="max-w-full max-h-full rounded-lg"
                    onMouseDown={handleCropStart}
                    onMouseMove={handleCropMove}
                    onMouseUp={handleCropEnd}
                    onMouseLeave={handleCropEnd}
                  />
                </div>
                <div className="w-1/2 p-6 border-l border-white border-opacity-20 overflow-y-auto flex flex-col bg-black bg-opacity-30">
                  <div className="mb-6">
                    {renderEditTabs()}
                    <div className="mt-4 bg-white bg-opacity-10 p-4 rounded-lg">
                      {renderTabContent()}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-semibold mb-3 text-white">
                      Preview
                    </h4>
                    <div
                      className="border border-white border-opacity-20 rounded-lg overflow-hidden"
                      style={{ height: "300px" }}
                    >
                      <canvas
                        ref={previewCanvasRef}
                        className="w-full h-full object-contain"
                        width={300}
                        height={300}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between p-6 border-t border-white border-opacity-20 bg-black bg-opacity-30">
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setZoomLevel((prev) => Math.max(0.1, prev - 0.1));
                    applyChanges();
                  }}
                  className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors duration-300"
                >
                  <AiOutlineZoomOut className="text-xl text-white" />
                </button>
                <button
                  onClick={() => {
                    setZoomLevel((prev) => Math.min(3, prev + 0.1));
                    applyChanges();
                  }}
                  className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors duration-300"
                >
                  <AiOutlineZoomIn className="text-xl text-white" />
                </button>
                <button
                  onClick={() => {
                    setRotation((prev) => (prev - 90 + 360) % 360);
                    applyChanges();
                  }}
                  className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors duration-300"
                >
                  <AiOutlineRotateLeft className="text-xl text-white" />
                </button>
                <button
                  onClick={() => {
                    setRotation((prev) => (prev + 90) % 360);
                    applyChanges();
                  }}
                  className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors duration-300"
                >
                  <AiOutlineRotateRight className="text-xl text-white" />
                </button>
              </div>
              <div className="space-x-4">
                <button
                  onClick={resetChanges}
                  className="px-6 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors duration-300"
                >
                  <FaUndo className="inline mr-2" /> Reset
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  <FaSave className="inline mr-2" /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCropAspect;
