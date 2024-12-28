import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";
import Modal from "react-modal";
import { BiCloudUpload } from "react-icons/bi";
import { GoShieldLock } from "react-icons/go";

const FixedCropAspect = () => {
  const [formData, setFormData] = useState({ image: null });
  const [errors, setErrors] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 1) {
      alert("Please select only one image.");
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setModalIsOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const saveCroppedImage = async () => {
    setLoading(true);
    try {
      const croppedImageUrl = await getCroppedImg(image, croppedAreaPixels);
      setCroppedImage(croppedImageUrl);
      setFormData({ ...formData, image: croppedImageUrl });
      setModalIsOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getCroppedImg = (imageSrc, crop) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const { width, height } = crop;
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(
          image,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          width,
          height
        );

        canvas.toBlob((blob) => {
          if (!blob) {
            console.error("Canvas is empty");
            return reject(new Error("Canvas is empty"));
          }
          const fileUrl = URL.createObjectURL(blob);
          resolve(fileUrl);
        }, "image/jpeg");
      };
      image.onerror = (error) => reject(error);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <div className="flex justify-center bg-gray-100 p-6 rounded-lg shadow-md mt-4">
      <div className="flex-col w-full max-w-lg">
        <form className="space-y-4">
          {/* Image Drop Area */}
          <label className="block text-sm font-medium text-gray-700">
            Fixed Crop Aspects
          </label>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition"
          >
            <input {...getInputProps()} />
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

          {/* Display Cropped Image */}
          {croppedImage && (
            <div className="mt-4">
              <img
                src={croppedImage}
                alt="Cropped"
                className="w-full max-h-60 object-cover rounded-lg border"
              />
            </div>
          )}
        </form>
      </div>

      {/* Modal for Cropping Image */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            height: "400px",
            borderRadius: "8px",
            padding: "20px",
          },
        }}
      >
        <button
          onClick={() => setModalIsOpen(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-lg font-medium text-center">Crop your image</h2>
        <p className="text-sm mb-6 text-center text-gray-600">
          (Use the mouse wheel to scroll to zoom the image)
        </p>
        {image && (
          <div style={{ position: "relative", width: "100%", height: "250px" }}>
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              onCropChange={setCrop}
              onCropComplete={handleCropComplete}
              onZoomChange={setZoom}
            />
          </div>
        )}
        <button
          onClick={saveCroppedImage}
          className={`mt-4 p-2 ${
            loading ? "bg-gray-400" : "bg-green-500"
          } text-white rounded w-full hover:bg-green-600`}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Cropped Image"}
        </button>
      </Modal>
    </div>
  );
};

export default FixedCropAspect;
