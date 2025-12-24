'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Camera, Upload, X } from 'lucide-react';
import { tokens } from '@/styles/tokens';

interface ProfilePhotoProps {
  photoRef: React.RefObject<HTMLImageElement>;
  onSave: (photo: string) => void;
  initialPhoto?: string;
}

export function ProfilePhoto({ photoRef, onSave, initialPhoto = '' }: ProfilePhotoProps) {
  const t = useTranslations('photo');
  const [photo, setPhoto] = useState(initialPhoto);
  const [isDirty, setIsDirty] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<'idle' | 'starting' | 'started' | 'error'>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialPhoto && photoRef.current) {
      setPhoto(initialPhoto);
      photoRef.current.src = initialPhoto;
    }
  }, [initialPhoto, photoRef]);

  const markDirtyWith = (dataUrl: string) => {
    setPhoto(dataUrl);
    setIsDirty(true);
    if (photoRef.current) {
      photoRef.current.src = dataUrl;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    stopCamera();
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;

      img.onload = () => {
        const cropSize = 400;
        const scale = Math.max(cropSize / img.width, cropSize / img.height);
        const resizedWidth = Math.ceil(img.width * scale);
        const resizedHeight = Math.ceil(img.height * scale);

        const resizeCanvas = document.createElement('canvas');
        const resizeCtx = resizeCanvas.getContext('2d');
        resizeCanvas.width = resizedWidth;
        resizeCanvas.height = resizedHeight;
        resizeCtx?.drawImage(img, 0, 0, resizedWidth, resizedHeight);

        const cropCanvas = document.createElement('canvas');
        const cropCtx = cropCanvas.getContext('2d');
        cropCanvas.width = cropSize;
        cropCanvas.height = cropSize;

        const sx = Math.max(0, (resizedWidth - cropSize) / 2);
        const sy = Math.max(0, (resizedHeight - cropSize) / 2);
        cropCtx?.drawImage(resizeCanvas, sx, sy, cropSize, cropSize, 0, 0, cropSize, cropSize);

        const croppedImage = cropCanvas.toDataURL('image/png');
        markDirtyWith(croppedImage);
      };
    };

    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    setCameraStatus('starting');
    setPhoto('');
    setIsDirty(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraStatus('started');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraStatus('error');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setCameraStatus('idle');
    }
  };

  const capturePhoto = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const context = canvasRef.current.getContext('2d');
    const video = videoRef.current;
    context?.drawImage(video, 0, 0, canvasRef.current.width, canvasRef.current.height);

    const offScreenCanvas = document.createElement('canvas');
    offScreenCanvas.width = video.videoWidth;
    offScreenCanvas.height = video.videoHeight;
    const offScreenContext = offScreenCanvas.getContext('2d');
    offScreenContext?.drawImage(video, 0, 0);

    const cropWidth = 400;
    const cropHeight = 400;
    const cropX = (offScreenCanvas.width - cropWidth) / 2;
    const cropY = (offScreenCanvas.height - cropHeight) / 2;

    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = cropWidth;
    finalCanvas.height = cropHeight;
    const finalContext = finalCanvas.getContext('2d');
    finalContext?.drawImage(
      offScreenCanvas,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    const finalPhoto = finalCanvas.toDataURL('image/png');
    markDirtyWith(finalPhoto);
    stopCamera();
  };

  const cancelChanges = () => {
    stopCamera();
    setPhoto(initialPhoto);
    if (photoRef.current) {
      photoRef.current.src = initialPhoto;
    }
    setIsDirty(false);
  };

  const handleSave = () => {
    if (photo) {
      onSave(photo);
    }
  };

  return (
    <div className="w-full">
      <h2 className="block text-sm mt-0 mb-4 font-medium" style={{ color: tokens.colors.textMuted }}>
        {t('takeSelfie')}
      </h2>

      <div className="mb-4">
        {cameraStatus === 'started' ? (
          <div className="relative h-[300px] bg-gray-900 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <button
                type="button"
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-white border-4 border-pink-500 flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Camera size={24} className="text-pink-500" />
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center hover:scale-110 transition-transform"
              >
                <X size={24} className="text-white" />
              </button>
            </div>
          </div>
        ) : photo ? (
          <div className="relative">
            <div className="border-4 border-pink-500 rounded-full overflow-hidden w-32 h-32 mx-auto">
              <img
                src={photo}
                alt={t('captured')}
                className="object-cover w-full h-full"
              />
            </div>
            {isDirty && (
              <button
                type="button"
                onClick={handleSave}
                className="w-full mt-4 transition-all text-white py-2 px-4 focus:outline-none focus:shadow-outline bg-emerald-600 rounded-lg hover:bg-emerald-700"
              >
                Save Changes
              </button>
            )}
          </div>
        ) : (
          <div
            className="flex items-center justify-center h-[137px] bg-[#E4E4E4] rounded-lg cursor-pointer hover:bg-[#D4D4D4] transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center">
              <Upload size={32} className="mx-auto mb-2 text-gray-500" />
              <p className="text-sm text-gray-600">{t('uploadImage')}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {cameraStatus === 'idle' && !photo && (
          <>
            <button
              type="button"
              onClick={startCamera}
              className="w-full transition-all text-white py-2 px-4 focus:outline-none focus:shadow-outline bg-[#FF5EA3] rounded-lg hover:bg-[#FF7DF2]"
            >
              {t('takeSelfie')}
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full transition-all text-white py-2 px-4 focus:outline-none focus:shadow-outline bg-gray-500 rounded-lg hover:bg-gray-600"
            >
              {t('uploadImage')}
            </button>
          </>
        )}

        {photo && (
          <>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full transition-all text-white py-2 px-4 focus:outline-none focus:shadow-outline bg-[#FF5EA3] rounded-lg hover:bg-[#FF7DF2]"
            >
              {isDirty ? t('uploadAnotherImage') : t('uploadImage')}
            </button>
            <button
              type="button"
              onClick={cancelChanges}
              className="w-full transition-all text-white py-2 px-4 focus:outline-none focus:shadow-outline bg-gray-500 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" width={400} height={400} />
    </div>
  );
}

