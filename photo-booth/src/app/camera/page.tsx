// app/camera/page.tsx
'use client'; // Mark this as a Client Component

import { useEffect, useRef, useState } from 'react';
import Photocard from '../components/Photocard';

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  // Access the webcam
  useEffect(() => {
    const enableStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error('Error accessing the camera', err);
      }
    };

    enableStream();
  }, []);

  // Capture a photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photo = canvas.toDataURL('image/png');
        setPhotos((prev) => [...prev, photo]);
      }
    }
  };

  return (
    <div>
      <h1>Photo Booth</h1>
      <video ref={videoRef} autoPlay playsInline muted />
      <button onClick={capturePhoto} disabled={photos.length >= 4}>
        Capture Photo ({photos.length}/4)
      </button>
      {photos.length === 4 && <Photocard photos={photos} />}
    </div>
  );
}