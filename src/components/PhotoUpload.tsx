"use client";

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react';
import { Area } from 'react-easy-crop';

interface PhotoUploadProps {
  onPhotoSelected: (photoUrl: string) => void;
  currentPhoto?: string;
  shape?: 'circle' | 'square';
  onShapeChange: (shape: 'circle' | 'square') => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export default function PhotoUpload({
  onPhotoSelected,
  currentPhoto,
  shape = 'circle',
  onShapeChange,
}: PhotoUploadProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > MAX_FILE_SIZE) {
        setError("File size exceeds 2MB limit.");
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result?.toString() || null));
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.size > MAX_FILE_SIZE) {
        setError("File size exceeds 2MB limit.");
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result?.toString() || null));
      reader.readAsDataURL(file);
    }
  };

  const showCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onPhotoSelected(croppedImage);
      setImageSrc(null); // Close crop modal
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels, onPhotoSelected]);

  return (
    <div className="space-y-4 mb-6">
      <div className="flex justify-between items-end border-b border-surface pb-2">
         <h3 className="text-sm font-bold font-mono tracking-widest text-accent-purple uppercase">Profile_Photo</h3>
         <div className="flex gap-2">
            <button
               type="button"
               onClick={() => onShapeChange('circle')}
               className={`text-[10px] font-mono px-2 py-1 uppercase border ${shape === 'circle' ? 'border-accent-cyan text-accent-cyan bg-accent-cyan/10' : 'border-surface text-text-secondary'}`}
            >
               Circle
            </button>
            <button
               type="button"
               onClick={() => onShapeChange('square')}
               className={`text-[10px] font-mono px-2 py-1 uppercase border ${shape === 'square' ? 'border-accent-cyan text-accent-cyan bg-accent-cyan/10' : 'border-surface text-text-secondary'}`}
            >
               Square
            </button>
         </div>
      </div>

      {!imageSrc && (
        <div 
           className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-surface bg-white/5 hover:border-accent-cyan/50 hover:bg-white/10 transition-colors cursor-pointer group"
           onDragOver={handleDragOver}
           onDrop={handleDrop}
           onClick={() => document.getElementById('photo-upload')?.click()}
        >
          {currentPhoto ? (
            <div className="relative mb-4">
              <img 
                 src={currentPhoto} 
                 alt="Profile" 
                 className={`w-24 h-24 object-cover ${shape === 'circle' ? 'rounded-full' : 'rounded-2xl'} border-2 border-accent-cyan`}
              />
              <button
                 type="button"
                 onClick={(e) => { e.stopPropagation(); onPhotoSelected(''); }}
                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                 <X size={12} />
              </button>
            </div>
          ) : (
            <Upload size={32} className="text-text-secondary group-hover:text-accent-cyan mb-2 transition-colors" />
          )}
          <p className="text-[11px] font-mono font-bold text-center uppercase tracking-widest text-text-secondary">
             {currentPhoto ? 'REPLACE_PHOTO' : 'DRAG_AND_DROP_OR_CLICK_TO_UPLOAD'}
          </p>
          <p className="text-[9px] font-mono text-center text-text-secondary/70 mt-1">
             Max size: 2MB. Recommended: Square aspect ratio.
          </p>
          {error && <p className="text-red-500 text-xs font-mono mt-2 uppercase">{error}</p>}
          <input 
             id="photo-upload" 
             type="file" 
             accept="image/*" 
             className="hidden" 
             onChange={handleFileChange} 
          />
        </div>
      )}

      {imageSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 print:hidden">
          <div className="bg-[#111111] border border-surface w-full max-w-lg flex flex-col">
            <div className="p-4 border-b border-surface flex justify-between items-center bg-black/50">
               <div className="font-mono text-xs font-bold uppercase tracking-widest text-accent-cyan flex items-center gap-2">
                 <ImageIcon size={14} /> IMAGE_CALIBRATION
               </div>
               <button type="button" onClick={() => setImageSrc(null)} className="text-text-secondary hover:text-white"><X size={16} /></button>
            </div>
            <div className="relative w-full h-[400px] bg-black">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape={shape === 'circle' ? 'round' : 'rect'}
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="p-4 border-t border-surface space-y-4 bg-black/50">
               <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono font-bold text-text-secondary uppercase">ZOOM</span>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1 accent-accent-cyan"
                  />
               </div>
               <div className="flex justify-end gap-3">
                 <button type="button" onClick={() => setImageSrc(null)} className="px-4 py-2 font-mono text-[10px] font-bold uppercase border border-surface text-text-secondary hover:text-white">CANCEL</button>
                 <button type="button" onClick={showCroppedImage} className="px-6 py-2 font-mono text-[10px] font-bold uppercase bg-accent-cyan text-black flex items-center gap-2 hover:bg-accent-cyan/90">
                   <Check size={14} /> CONFIRM_CROP
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Utility function to get cropped image
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return '';
  }

  // set canvas size to match the bounding box
  canvas.width = image.width;
  canvas.height = image.height;

  ctx.translate(image.width / 2, image.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement('canvas');
  const croppedCtx = croppedCanvas.getContext('2d');

  if (!croppedCtx) {
    return '';
  }

  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    croppedCanvas.toBlob((blob) => {
      if (!blob) {
        console.error('Canvas is empty');
        return;
      }
      resolve(URL.createObjectURL(blob));
    }, 'image/jpeg');
  });
}
