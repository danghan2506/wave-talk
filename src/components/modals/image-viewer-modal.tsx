"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Download, Loader2 } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
const ImageViewerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const isModalOpen = isOpen && type === "imageViewer";
  const { imageUrl, imageName } = data;
  useEffect(() => {
    if (isModalOpen) {
      setIsLoading(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
    }
  }, [isModalOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  // Handle close with animation
  const handleClose = () => {
    setIsAnimating(false);
    // Wait for exit animation before actually closing
    setTimeout(() => {
      onClose();
    }, 200);
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Handle image load complete
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Handle download
  const handleDownload = async () => {
    if (!imageUrl) return;
    
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = imageName || "image";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Fallback: open in new tab
      window.open(imageUrl, "_blank");
    }
  };

  if (!isModalOpen) return null;

  return (
    // Portal-like behavior using fixed positioning
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center",
        "transition-all duration-300 ease-out",
        isAnimating 
          ? "opacity-100" 
          : "opacity-0"
      )}
      onClick={handleBackdropClick}
    >
      {/* Backdrop with blur effect - pointer-events-none so clicks pass to parent */}
      <div 
        className={cn(
          "absolute inset-0 bg-black/80 backdrop-blur-md pointer-events-none",
          "transition-all duration-300 ease-out",
          isAnimating 
            ? "opacity-100 backdrop-blur-md" 
            : "opacity-0 backdrop-blur-none"
        )}
      />

      {/* Close button */}
      <button
        onClick={handleClose}
        className={cn(
          "absolute top-4 right-4 z-10",
          "p-2 rounded-full bg-white/10 hover:bg-white/20",
          "text-white transition-all duration-200",
          "hover:scale-110 active:scale-95",
          "focus:outline-none focus:ring-2 focus:ring-white/50"
        )}
        aria-label="Close image viewer"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Download button */}
      <button
        onClick={handleDownload}
        className={cn(
          "absolute top-4 right-16 z-10",
          "p-2 rounded-full bg-white/10 hover:bg-white/20",
          "text-white transition-all duration-200",
          "hover:scale-110 active:scale-95",
          "focus:outline-none focus:ring-2 focus:ring-white/50"
        )}
        aria-label="Download image"
        title="Download image"
      >
        <Download className="h-6 w-6" />
      </button>

      {/* Image container */}
      <div
        className={cn(
          "relative max-w-[90vw] max-h-[90vh]",
          "transition-all duration-300 ease-out",
          isAnimating 
            ? "opacity-100 scale-100" 
            : "opacity-0 scale-95"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-10 w-10 text-white animate-spin" />
          </div>
        )}

        {/* Main image */}
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={imageName || "Image preview"}
            width={1200}
            height={800}
            className={cn(
              "max-w-[90vw] max-h-[85vh] w-auto h-auto",
              "object-contain rounded-lg shadow-2xl",
              "transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            unoptimized
            onLoad={handleImageLoad}
            priority
          />
        )}
      </div>
    </div>
  );
};

export default ImageViewerModal;
