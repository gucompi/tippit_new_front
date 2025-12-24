'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Camera, Upload } from 'lucide-react';
import { tokens } from '@/styles/tokens';

interface Step3Props {
  photo: string;
  cameraStatus: 'idle' | 'starting' | 'started' | 'error';
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isIphoneDevice: boolean;
  onStartCamera: () => void;
  onCapturePhoto: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Step3Photo({
  photo,
  cameraStatus,
  videoRef,
  canvasRef,
  isIphoneDevice,
  onStartCamera,
  onCapturePhoto,
  onFileUpload,
}: Step3Props) {
  const t = useTranslations('register.step3');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      const syntheticEvent = {
        target: { files },
      } as React.ChangeEvent<HTMLInputElement>;
      onFileUpload(syntheticEvent);
    }
  };

  return (
    <>
      {/* Photo Preview Circle */}
      <div className="w-full max-w-[379px] flex flex-col items-center mb-6">
        <div className="relative flex-shrink-0">
          {photo ? (
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-2 border-[#D9D9D9] relative">
              <img
                src={photo}
                alt="Profile"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </div>
          ) : cameraStatus === 'started' || cameraStatus === 'starting' ? (
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-2 border-[#D9D9D9] relative">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
            </div>
          ) : (
            <div className="w-[120px] h-[120px] rounded-full bg-[#D9D9D9] border-2 border-[#D9D9D9] flex items-center justify-center">
              <Camera size={48} className="text-gray-400" />
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" width={400} height={400} />
        </div>
      </div>

      {/* Upload Area */}
      <div className="w-full max-w-[379px] mb-4">
        <label
          className="text-sm font-bold leading-5 block mb-2"
          style={{
            color: tokens.colors.textInput,
            fontFamily: tokens.typography.fontFamily.primary,
            letterSpacing: tokens.typography.letterSpacing.tight,
          }}
        >
          {t('profilePhoto')}
        </label>
        <div
          className="relative text-center cursor-pointer hover:bg-[#FFF5F9] transition-colors flex items-center justify-center"
          style={{
            height: '116px',
            borderRadius: '30px',
            border: `2px dashed ${tokens.colors.primary}`,
          }}
          onClick={handleDropZoneClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            <Upload size={32} className="text-[#D2D2D2] mb-2" />
            <p
              className="text-sm font-semibold"
              style={{
                fontFamily: tokens.typography.fontFamily.primary,
                color: '#757575',
              }}
            >
              {t('uploadPhoto')}
            </p>
            <p
              className="text-xs mt-1"
              style={{
                fontFamily: tokens.typography.fontFamily.primary,
                color: '#757575',
              }}
            >
              {t('dragDrop')}
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileUpload}
          className="hidden"
        />
      </div>

      {/* Camera Link */}
      <div className="w-full max-w-[379px] text-center mb-6">
        {cameraStatus === 'idle' && !isIphoneDevice && (
          <button
            type="button"
            onClick={onStartCamera}
            className="text-sm underline underline-offset-4 hover:text-[#FF5EA3] transition-colors"
            style={{
              fontFamily: tokens.typography.fontFamily.primary,
              fontWeight: tokens.typography.fontWeight.medium,
              color: tokens.colors.textInput,
            }}
          >
            {t('takePhoto')}
          </button>
        )}
        {cameraStatus === 'starting' && (
          <p className="text-sm text-gray-500">{t('cameraStarting')}</p>
        )}
        {cameraStatus === 'started' && (
          <button
            type="button"
            onClick={onCapturePhoto}
            className="text-sm underline underline-offset-4 hover:text-[#FF5EA3] transition-colors"
            style={{
              fontFamily: tokens.typography.fontFamily.primary,
              fontWeight: tokens.typography.fontWeight.medium,
              color: tokens.colors.textInput,
            }}
          >
            {t('capturePhoto')}
          </button>
        )}
        {cameraStatus === 'error' && (
          <p className="text-sm" style={{ color: tokens.colors.error }}>
            {t('cameraError')}
          </p>
        )}
      </div>

      {/* Validation Message */}
      {!photo && (
        <div className="w-full max-w-[379px] mb-4">
          <p className="text-sm text-center" style={{ color: tokens.colors.error }}>
            *{t('photoRequired')}
          </p>
        </div>
      )}
    </>
  );
}

