import React, { useState, useRef } from "react";
import { Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Cropper, { Area } from "react-easy-crop";
import {
  handleImageSelect,
  cropImageFile,
  handleUploadCroppedImage,
} from "@/utils/imageUtils";

interface ImageUploadProps {
  max?: number;
  isCrop?: boolean;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  max = 1,
  isCrop = false,
  setImages,
}) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState({ width: 1, height: 1 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleImageSelect(event, setSelectedImages, setIsModalOpen);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setSelectedImages(files);
    if (isCrop) {
      setIsModalOpen(true);
    } else {
      console.log("Cc");
      handleUploadImages(files);
    }
  };

  const handleUploadImages = async (files: File[]) => {
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          const imageUrl = await handleUploadCroppedImage(file);
          if (imageUrl) {
            setImages((prevImages) => [...prevImages, imageUrl]);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropConfirm = async () => {
    if (selectedImages[0] && croppedAreaPixels) {
      const croppedImage = await cropImageFile(
        croppedAreaPixels,
        URL.createObjectURL(selectedImages[0])
      );
      if (croppedImage) {
        const imageUrl = await handleUploadCroppedImage(croppedImage);
        if (imageUrl) {
          setImages((prevImages) => [...prevImages, imageUrl]);
        }
      }
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          multiple={max > 1}
          onChange={handleFileInputChange}
        />
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drop your image or upload here
        </p>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="h-64 relative">
              {selectedImages[0] && (
                <Cropper
                  image={URL.createObjectURL(selectedImages[0])}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect.width / aspect.height}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  type="number"
                  value={aspect.width}
                  onChange={(e) =>
                    setAspect({ ...aspect, width: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  value={aspect.height}
                  onChange={(e) =>
                    setAspect({ ...aspect, height: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCropConfirm}>Confirm Crop</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageUpload;
