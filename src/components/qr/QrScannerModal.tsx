"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QrCode, Camera, Upload, Search, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QrScannerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [batchCodeInput, setBatchCodeInput] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const router = useRouter();

  // Navigate to batch
  const handleNavigate = (rawInput: string) => {
    let cleanCode = rawInput.trim();
    // If user pasted a full URL like https://.../trace/HNY-2026-0001
    if (cleanCode.includes("/trace/")) {
      const parts = cleanCode.split("/trace/");
      cleanCode = parts[parts.length - 1];
    }
    // Remove query params or trailing slashes
    cleanCode = cleanCode.split("?")[0].replace(/\/+$/, "");

    if (cleanCode) {
      stopCamera();
      setIsOpen(false);
      router.push(`/trace/${encodeURIComponent(cleanCode)}`);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Start detection if BarcodeDetector is supported
      if ("BarcodeDetector" in window) {
        // @ts-expect-error - BarcodeDetector standard web API
        const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
        const intervalId = setInterval(async () => {
          if (!videoRef.current || videoRef.current.readyState < 2) return;
          try {
            const barcodes = await detector.detect(videoRef.current);
            if (barcodes.length > 0) {
              clearInterval(intervalId);
              handleNavigate(barcodes[0].rawValue);
            }
          } catch {
            // Ignore frame detection failures
          }
        }, 300);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Camera access denied or unavailable";
      setCameraError(message);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Handle uploaded image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if ("BarcodeDetector" in window) {
      try {
        // @ts-expect-error - BarcodeDetector standard web API
        const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await img.decode();
        const barcodes = await detector.detect(img);
        if (barcodes.length > 0) {
          handleNavigate(barcodes[0].rawValue);
          return;
        }
        setCameraError("No QR code detected in this image. Try another photo or enter code manually.");
      } catch {
        setCameraError("Could not decode image. Please enter batch code manually.");
      }
    } else {
      setCameraError("Image decoding not natively supported in this browser. Please enter the batch code manually.");
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="lg"
        className="space-x-2 text-base px-6 h-12 border-amber-300 hover:bg-amber-50 shadow-sm"
      >
        <Camera className="h-5 w-5 text-amber-600" />
        <span>Scan Jar QR Code</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-lg">Scan or Lookup Honey Batch</h3>
                  <p className="text-xs text-stone-500">Scan QR on honey jar or type batch code</p>
                </div>
              </div>
              <button
                onClick={() => {
                  stopCamera();
                  setIsOpen(false);
                }}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Camera View Area */}
            <div className="space-y-3">
              {isCameraActive ? (
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* QR Aiming Reticle */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 border-2 border-amber-400 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.4)] animate-pulse" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={startCamera}
                    className="flex-1 space-x-2 bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    <Camera className="h-4 w-4" />
                    <span>Open Camera to Scan</span>
                  </Button>

                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center space-x-2 border border-stone-300 rounded-lg py-2 px-4 hover:bg-stone-50 text-sm font-semibold text-stone-700 h-10">
                      <Upload className="h-4 w-4 text-stone-500" />
                      <span>Upload QR Photo</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              )}

              {cameraError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2 text-xs text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{cameraError}</span>
                </div>
              )}
            </div>

            {/* Manual Code Input */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <label className="text-xs font-semibold text-stone-700">
                Or Enter Batch Code Manually:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. HNY-2026-0001"
                  value={batchCodeInput}
                  onChange={(e) => setBatchCodeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleNavigate(batchCodeInput);
                  }}
                  className="flex-1 px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <Button
                  onClick={() => handleNavigate(batchCodeInput)}
                  disabled={!batchCodeInput.trim()}
                  className="space-x-1"
                >
                  <Search className="h-4 w-4" />
                  <span>Trace</span>
                </Button>
              </div>
            </div>

            {/* Quick Demo Samples */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Quick Sample Jars:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleNavigate("HNY-2026-0001")}
                  className="text-xs font-mono bg-amber-50 text-amber-800 border border-amber-200 rounded-md px-2.5 py-1 hover:bg-amber-100"
                >
                  HNY-2026-0001 (Organic Wildflower)
                </button>
                <button
                  onClick={() => handleNavigate("HNY-2026-0002")}
                  className="text-xs font-mono bg-red-50 text-red-700 border border-red-200 rounded-md px-2.5 py-1 hover:bg-red-100"
                >
                  HNY-2026-0002 (Recalled Adulteration)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

