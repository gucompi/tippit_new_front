'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

type CameraStatus = 'idle' | 'starting' | 'started' | 'error';

export function useCamera() {
  const [photo, setPhoto] = useState<string>('');
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isIphone = () => typeof navigator !== 'undefined' && /iPhone/.test(navigator.userAgent);
  const [isIphoneDevice] = useState(isIphone());

  // Cleanup camera on unmount
  useEffect(() => {
    const videoElement = videoRef.current;
    return () => {
      if (videoElement && videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoElement.srcObject = null;
      }
    };
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setCameraStatus('starting');

      // Wait a bit for React to render the video element
      await new Promise((resolve) => setTimeout(resolve, 100));

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });

      // Retry a few times if video element is not ready yet
      let retries = 0;
      while (!videoRef.current && retries < 10) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        retries++;
      }

      if (!videoRef.current) {
        console.error('Video element not available after retries');
        setCameraStatus('error');
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setCameraStatus('started');
    } catch (error) {
      console.error('Error starting camera:', error);
      setCameraStatus('error');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setCameraStatus('idle');
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!canvasRef.current || !videoRef.current) return;

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    const video = videoRef.current;
    
    // Set canvas size
    canvasRef.current.width = 400;
    canvasRef.current.height = 400;

    // Create off-screen canvas for processing
    const offScreenCanvas = document.createElement('canvas');
    offScreenCanvas.width = video.videoWidth;
    offScreenCanvas.height = video.videoHeight;
    const offScreenContext = offScreenCanvas.getContext('2d');
    if (!offScreenContext) return;
    
    offScreenContext.drawImage(video, 0, 0);

    // Crop to center square
    const cropSize = Math.min(offScreenCanvas.width, offScreenCanvas.height);
    const cropX = (offScreenCanvas.width - cropSize) / 2;
    const cropY = (offScreenCanvas.height - cropSize) / 2;

    // Draw cropped image to final canvas
    context.drawImage(
      offScreenCanvas,
      cropX,
      cropY,
      cropSize,
      cropSize,
      0,
      0,
      400,
      400
    );

    const finalPhoto = canvasRef.current.toDataURL('image/png');
    setPhoto(finalPhoto);
    stopCamera();
  }, [stopCamera]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      const img = new Image();
      img.src = result;

      img.onload = () => {
        const resizeCanvas = document.createElement('canvas');
        const resizeCtx = resizeCanvas.getContext('2d');
        if (!resizeCtx) return;

        const targetWidth = 500;
        const scaleFactor = targetWidth / img.width;
        const targetHeight = img.height * scaleFactor;

        resizeCanvas.width = targetWidth;
        resizeCanvas.height = targetHeight;
        resizeCtx.drawImage(img, 0, 0, targetWidth, targetHeight);

        const cropCanvas = document.createElement('canvas');
        const cropCtx = cropCanvas.getContext('2d');
        if (!cropCtx) return;

        const cropSize = 400;
        cropCanvas.width = cropSize;
        cropCanvas.height = cropSize;

        const sx = (targetWidth - cropSize) / 2;
        const sy = Math.max(0, (targetHeight - cropSize) / 4);

        cropCtx.drawImage(
          resizeCanvas,
          sx,
          sy,
          cropSize,
          cropSize,
          0,
          0,
          cropSize,
          cropSize
        );

        const croppedImage = cropCanvas.toDataURL();
        setPhoto(croppedImage);
      };
    };

    reader.readAsDataURL(file);
  }, []);

  const clearPhoto = useCallback(() => {
    setPhoto('');
  }, []);

  return {
    photo,
    cameraStatus,
    videoRef,
    canvasRef,
    isIphoneDevice,
    startCamera,
    stopCamera,
    capturePhoto,
    handleFileUpload,
    clearPhoto,
    setPhoto,
  };
}

