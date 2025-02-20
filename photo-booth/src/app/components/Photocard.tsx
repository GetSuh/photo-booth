// app/components/Photocard.tsx
'use client';

import { useEffect, useRef } from 'react';

export default function Photocard({ photos }: { photos: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        // Set canvas size (adjust as needed)
        canvas.width = 800;
        canvas.height = 600;

        // Draw each photo on the canvas
        photos.forEach((photo, index) => {
          const img = new Image();
          img.src = photo;
          img.onload = () => {
            // Position each photo in a 2x2 grid
            const x = (index % 2) * (canvas.width / 2);
            const y = Math.floor(index / 2) * (canvas.height / 2);
            context.drawImage(img, x, y, canvas.width / 2, canvas.height / 2);
          };
        });
      }
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
      <canvas ref={canvasRef} width={800} height={600} style={{ border: '1px solid black' }} />
      <button onClick={downloadPhotocard}>Download Photocard</button>
    </div>
  );
}