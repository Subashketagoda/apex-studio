"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, RefreshCw, X, Sparkles, ShieldCheck } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

interface CameraQRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

export default function CameraQRScanner({
  onScanSuccess,
  onClose,
}: CameraQRScannerProps) {
  const [cameraError, setCameraError] = useState<string>("");
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    let isMounted = true;
    const scannerId = "html5-qr-reader";

    const startCamera = async () => {
      try {
        const html5QrCode = new Html5Qrcode(scannerId);
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: facingMode },
          {
            fps: 15,
            qrbox: { width: 260, height: 260 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            if (isMounted) {
              onScanSuccess(decodedText);
            }
          },
          () => {
            // Frame scan no-match (ignore)
          }
        );
      } catch (err: any) {
        console.error("Camera scanner start error:", err);
        if (isMounted) {
          setCameraError(
            err?.message || "Unable to access device camera. Please check browser camera permissions."
          );
        }
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current?.clear())
          .catch(() => {});
      }
    };
  }, [facingMode, onScanSuccess]);

  const toggleCamera = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch {}
    }
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  return (
    <div className="relative p-5 rounded-sm bg-[#0c0c0c] border border-white/20 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
      {/* Scanner Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-sm bg-accent/20 border border-accent flex items-center justify-center text-accent">
            <Camera size={16} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-heading font-bold text-white tracking-wider">
              LIVE CAMERA SCANNER
            </h3>
            <p className="text-[9px] font-mono text-accent">
              Aim camera at guest VIP QR Pass
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleCamera}
            className="p-1.5 rounded bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-mono text-text-muted hover:text-white flex items-center gap-1"
            title="Switch camera"
          >
            <RefreshCw size={12} />
            <span className="text-[10px] hidden sm:inline">Flip Cam</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded bg-white/[0.04] border border-white/10 hover:border-rose-400 text-text-muted hover:text-white text-xs"
            title="Close camera"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Video Viewfinder Container */}
      <div className="relative w-full max-w-sm mx-auto aspect-square rounded-sm overflow-hidden border border-white/15 bg-black">
        <div id="html5-qr-reader" className="w-full h-full" />

        {/* Viewfinder Targeting Overlays */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-64 h-64 border-2 border-dashed border-accent/60 rounded-sm relative">
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-accent" />
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-accent" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-accent" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-accent" />
          </div>
        </div>
      </div>

      {cameraError && (
        <div className="p-3 rounded bg-rose-950/50 border border-rose-500/40 text-rose-300 font-mono text-xs text-center">
          {cameraError}
        </div>
      )}

      <p className="text-[10px] font-mono text-text-muted text-center">
        Camera runs 100% locally on device • Instant QR barcode detection
      </p>
    </div>
  );
}
