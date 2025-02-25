'use client';

import { useEffect, useRef } from 'react';

export default function Photocard({ photos }: { photos: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (photos.length === 0) return;

    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      const img = new Image();
      img.src = photos[0]; // Load first image to get dimensions
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const scaledWidth = 400; // Fixed width for consistent layout
        const scaledHeight = scaledWidth / aspectRatio;
        
        // Calculate final canvas size
        canvas.width = scaledWidth;
        canvas.height = scaledHeight * photos.length; // Stack images

        photos.forEach((photo, index) => {
          const imgElement = new Image();
          imgElement.src = photo;
          imgElement.onload = () => {
            const y = index * scaledHeight; // Stack images vertically
            context?.drawImage(imgElement, 0, y, scaledWidth, scaledHeight);
          };
        });
      };
    }
  }, [photos]);

  // Download the photocard
  const downloadPhotocard = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'photocard.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div>
      <canvas ref={canvasRef} style={{ border: '1px solid black' }} />
      
    </div>
  );
}
