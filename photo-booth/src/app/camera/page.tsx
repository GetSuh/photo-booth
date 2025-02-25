'use client';

import { useEffect, useRef, useState } from 'react';
import Photocard from '../components/Photocard';
import html2canvas from 'html2canvas';

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const photocardRef = useRef<HTMLDivElement>(null);

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

  // Reset the photocard and start over
  const startOver = () => {
    setPhotos([]);
    setShowModal(false);
  };

  // Open confirmation modal
  const confirmDownload = () => {
    setShowModal(true);
  };

  // Download the photocard as an image
  const downloadPhotocard = () => {
    if (photocardRef.current) {
      html2canvas(photocardRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'photocard.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
    setShowModal(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Photo Booth</h1>

      {/* Webcam Preview */}
      <div className="w-[80%] max-w-md bg-black rounded-lg overflow-hidden shadow-lg">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto filter brightness-110 contrast-105" />
      </div>

      {/* Capture Button */}
      <button
        onClick={capturePhoto}
        disabled={photos.length >= 4}
        className={`mt-4 px-6 py-2 text-lg font-semibold text-white rounded-lg shadow-md transition 
        ${photos.length >= 4 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        Capture Photo ({photos.length}/4)
      </button>

      {/* Display Photocard when 4 photos are taken */}
      {photos.length === 4 && (
        <div className="mt-6 flex flex-col items-center">
          <div ref={photocardRef} className="bg-white p-4 rounded-lg shadow-lg">
            <Photocard photos={photos} />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={confirmDownload}
              className="px-6 py-2 text-lg font-semibold text-white bg-green-500 rounded-lg shadow-md transition hover:bg-green-600"
            >
              Download Photocard
            </button>
            <button
              onClick={startOver}
              className="px-6 py-2 text-lg font-semibold text-white bg-red-500 rounded-lg shadow-md transition hover:bg-red-600"
            >
              Start Over
            </button>
          </div>
        </div>
      )}

      {/* Download Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold text-gray-800">Download Photocard?</h2>
            <p className="text-gray-600 mt-2">Do you want to download your photocard?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={downloadPhotocard}
                className="px-4 py-2 text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600"
              >
                Yes, Download
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-white bg-gray-500 rounded-lg shadow-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
