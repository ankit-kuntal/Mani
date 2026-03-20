'use client';

import { useEffect, useRef } from 'react';

export function PuzzleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 500;
    canvas.height = 300;

    // Fill background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the puzzle "image" (placeholder)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🧩', canvas.width / 2, canvas.height / 2);

    // Add noise overlay
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 50;
      data[i] = Math.min(255, data[i] + noise); // R
      data[i + 1] = Math.min(255, data[i + 1] + noise); // G
      data[i + 2] = Math.min(255, data[i + 2] + noise); // B
    }

    ctx.putImageData(imageData, 0, 0);

    // Draw repeating watermark text
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.rotate((Math.PI / 180) * -45);

    for (let x = -500; x < canvas.width; x += 150) {
      for (let y = -300; y < canvas.height; y += 150) {
        ctx.fillText('WATERMARK', x, y);
      }
    }

    ctx.rotate((Math.PI / 180) * 45);
    ctx.globalAlpha = 1;

    // Disable right-click and text selection
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    canvas.addEventListener('selectstart', (e) => e.preventDefault());

    return () => {
      canvas.removeEventListener('contextmenu', (e) => e.preventDefault());
      canvas.removeEventListener('selectstart', (e) => e.preventDefault());
    };
  }, []);

  useEffect(() => {
    // Disable copy, cut, paste on document
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'x' || e.key === 'v')) {
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="puzzle-canvas-wrapper flex justify-center">
      <canvas
        ref={canvasRef}
        className="border border-border rounded-lg shadow-lg select-none"
        style={{ 
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
          WebkitUserDrag: 'none'
        } as any}
      />
    </div>
  );
}
