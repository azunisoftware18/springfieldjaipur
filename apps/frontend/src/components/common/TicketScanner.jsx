"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState, useRef } from "react";
import api from "@/lib/api";
import Button from "../ui/Button";
import { 
  ScanLine, 
  Camera, 
  X, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Upload,
  FileImage,
  FileText,
  XCircle
} from "lucide-react";

export default function TicketScanner() {
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("camera");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadPreview, setUploadPreview] = useState(null);
  const scannerRef = useRef(null);
  const readerContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(checkMobile);
  }, []);

  useEffect(() => {
    if (activeTab === "camera") {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        startScanner();
      }, 500);
    }
    return () => {
      if (activeTab === "camera") {
        stopScanner();
      }
    };
  }, [activeTab]);

  const startScanner = async () => {
    if (!readerContainerRef.current || activeTab !== "camera") return;
    
    setCameraError(null);
    
    try {
      // Clean up existing scanner
      if (scannerRef.current) {
        await stopScanner();
      }

      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;

      const isTablet = window.innerWidth <= 1024 && window.innerWidth >= 768;
      const qrboxSize = isMobile ? 250 : (isTablet ? 350 : 400);
      
      const config = { 
        fps: 10, 
        qrbox: { width: qrboxSize, height: qrboxSize },
        aspectRatio: 1.0,
        disableFlip: false,
      };

      // FORCE USE ONLY BACK CAMERA on mobile
      // On desktop, use default camera
      let cameraId = { facingMode: "environment" }; // "environment" = back camera
      
      // For mobile devices, explicitly try to get back camera
      if (isMobile) {
        try {
          const cameras = await Html5Qrcode.getCameras();
          const backCamera = cameras.find(cam => 
            cam.label.toLowerCase().includes('back') || 
            cam.label.toLowerCase().includes('rear') ||
            cam.label.toLowerCase().includes('environment')
          );
          if (backCamera) {
            cameraId = backCamera.id;
            console.log("Using back camera:", backCamera.label);
          } else {
            cameraId = { facingMode: "environment" };
          }
        } catch (err) {
          console.log("Using environment facing mode");
          cameraId = { facingMode: "environment" };
        }
      }
      
      await html5QrCode.start(
        cameraId,
        config,
        onScanSuccess,
        onScanError
      );
      setIsScanning(true);
    } catch (err) {
      console.error("Camera start error:", err);
      setCameraError(err.message || "Unable to access back camera. Please check permissions.");
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      } finally {
        scannerRef.current = null;
      }
    }
    setIsScanning(false);
  };

  const onScanSuccess = async (decodedText) => {
    // Stop scanner immediately after successful scan to prevent multiple scans
    await stopScanner();
    await processTicket(decodedText);
  };

  const onScanError = (error) => {
    // Silent fail for scanning errors
    console.debug("Scan error:", error);
  };

  const processTicket = async (qrData) => {
    try {
      const res = await api.post("/ticket/scan", {
        qrCode: qrData,
      });

      setResult({
        success: true,
        message: "Ticket verified successfully!",
        data: res.data.data,
      });
    } catch (err) {
      setResult({
        success: false,
        message: err?.response?.data?.message || "Invalid or already used ticket",
        data: null,
      });
    }
  };

  // Handle file upload (PDF/Image)
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setResult({
        success: false,
        message: "Please select a valid image (JPEG, PNG, WEBP) or PDF file",
        data: null,
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setResult({
        success: false,
        message: "File size should be less than 5MB",
        data: null,
      });
      return;
    }

    setSelectedFile(file);
    setUploadPreview(URL.createObjectURL(file));
    
    // Read QR code directly from file using html5-qrcode
    readQRFromFile(file);
  };

  // Client-side QR reading from file
  const readQRFromFile = (file) => {
    setIsProcessing(true);
    setResult(null);
    
    // Create a temporary div for QR scanning
    const tempDiv = document.createElement('div');
    tempDiv.id = 'temp-qr-reader';
    tempDiv.style.display = 'none';
    document.body.appendChild(tempDiv);
    
    const html5QrCode = new Html5Qrcode("temp-qr-reader");
    
    // Use scanFile method to read QR from image
    html5QrCode.scanFile(file, true)
      .then(decodedText => {
        console.log("QR Code detected:", decodedText);
        // Clean up
        html5QrCode.clear();
        document.body.removeChild(tempDiv);
        // Process the ticket
        processTicket(decodedText);
      })
      .catch(err => {
        console.error("QR read error:", err);
        // Try alternative method for PDF or difficult images
        if (file.type === 'application/pdf') {
          setResult({
            success: false,
            message: "PDF QR scanning requires server-side processing. Please upload an image file or use camera scan.",
            data: null,
          });
        } else {
          setResult({
            success: false,
            message: "No QR code found in the image. Please ensure the QR code is clearly visible and try again.",
            data: null,
          });
        }
        html5QrCode.clear();
        document.body.removeChild(tempDiv);
      })
      .finally(() => {
        setIsProcessing(false);
        setSelectedFile(null);
        // Don't clear upload preview immediately so user can see what they uploaded
      });
  };

  const handleReset = () => {
    setResult(null);
    setCameraError(null);
    setSelectedFile(null);
    if (uploadPreview) {
      URL.revokeObjectURL(uploadPreview);
      setUploadPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (activeTab === "camera") {
      setTimeout(() => startScanner(), 500);
    }
  };

  const clearUpload = () => {
    setSelectedFile(null);
    if (uploadPreview) {
      URL.revokeObjectURL(uploadPreview);
      setUploadPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setResult(null);
  };

  return (
    <div >
      <div className="max-w-2xl mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-3xl overflow-hidden">
          {/* Header */}
          

          {/* Tab Buttons */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => {
                setActiveTab("camera");
                setResult(null);
                clearUpload();
              }}
              className={`flex-1 py-4 text-center font-semibold transition-all ${
                activeTab === "camera"
                  ? "text-gray-600 border-b-2 border-gray-600 bg-gray-50"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Camera className="w-5 h-5 inline mr-2" />
              Camera Scan
            </button>
            <button
              onClick={() => {
                setActiveTab("upload");
                stopScanner();
                setResult(null);
              }}
              className={`flex-1 py-4 text-center font-semibold transition-all ${
                activeTab === "upload"
                  ? "text-gray-600 border-b-2 border-gray-600 bg-gray-50"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Upload className="w-5 h-5 inline mr-2" />
              Upload File
            </button>
          </div>

          <div className="p-6">
            {/* Camera Tab */}
            {activeTab === "camera" && (
              <>
                {/* Camera Error */}
                {cameraError && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-red-700 font-medium text-sm">{cameraError}</p>
                        <button
                          onClick={() => {
                            setCameraError(null);
                            startScanner();
                          }}
                          className="mt-2 text-sm text-red-600 font-medium hover:text-red-700"
                        >
                          Try Again →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scanner Container */}
                {!result && (
                  <div className="relative">
                    <div 
                      id="reader" 
                      ref={readerContainerRef}
                      className="overflow-hidden rounded-2xl bg-black"
                      style={{ 
                        width: "100%", 
                        minHeight: isMobile ? "350px" : "450px",
                        maxHeight: "550px"
                      }}
                    />
                    
                    {/* Scanner Overlay */}
                    {!isScanning && !cameraError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl">
                        <button
                          onClick={startScanner}
                          className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl font-semibold text-slate-800 hover:bg-slate-100 transition-all shadow-lg"
                        >
                          <Camera className="w-5 h-5" />
                          Start Back Camera
                        </button>
                      </div>
                    )}

                    {/* Scanning Indicator */}
                    {isScanning && (
                      <>
                        <div className="absolute top-4 right-4">
                          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                            SCANNING...
                          </div>
                        </div>
                        {/* Scanning Frame */}
                        <div className="absolute inset-0 border-2 border-green-500 rounded-2xl pointer-events-none animate-pulse"></div>
                      </>
                    )}
                  </div>
                )}

                {/* Camera Controls */}
                {isScanning && !result && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={stopScanner}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Stop Scanning
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Upload Tab */}
            {activeTab === "upload" && (
              <div className="space-y-4">
                {/* File Upload Area */}
                {!uploadPreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center cursor-pointer hover:border-violet-400 transition-all bg-slate-50"
                  >
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-slate-400 text-sm">
                      Support: Images (JPEG, PNG, WEBP) only
                    </p>
                    <p className="text-slate-400 text-xs mt-2">
                      Max file size: 5MB
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Preview Container */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {selectedFile?.type === 'application/pdf' ? (
                            <FileText className="w-8 h-8 text-red-500" />
                          ) : (
                            <FileImage className="w-8 h-8 text-blue-500" />
                          )}
                          <div>
                            <p className="font-medium text-slate-800 text-sm">
                              {selectedFile?.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {(selectedFile?.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={clearUpload}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Image Preview */}
                      {selectedFile?.type !== 'application/pdf' && (
                        <div className="mt-3 rounded-xl overflow-hidden bg-white border border-slate-200">
                          <img 
                            src={uploadPreview} 
                            alt="Preview" 
                            className="w-full h-auto max-h-64 object-contain"
                          />
                        </div>
                      )}

                      {/* PDF Warning */}
                      {selectedFile?.type === 'application/pdf' && (
                        <div className="mt-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                          <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                          <p className="text-sm text-yellow-700 text-center">
                            PDF files are not supported for direct QR scanning.<br/>
                            Please convert to image format (JPEG, PNG) or use camera scan.
                          </p>
                          <button
                            onClick={() => {
                              clearUpload();
                              fileInputRef.current?.click();
                            }}
                            className="mt-3 text-sm text-yellow-700 font-medium underline"
                          >
                            Select Image Instead →
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Processing Indicator */}
                    {isProcessing && (
                      <div className="absolute inset-0 bg-white/90 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-600 mx-auto mb-3"></div>
                          <p className="text-slate-600 font-medium">Reading QR Code...</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Upload Info */}
                {!uploadPreview && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-700 text-center">
                      💡 Tip: Ensure the QR code is clearly visible, well-lit, and centered in the image
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Result Section */}
            {result && (
              <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Result Card */}
                <div
                  className={`p-6 rounded-2xl ${
                    result.success
                      ? "bg-linear-to-br from-green-50 to-emerald-50 border border-green-200"
                      : "bg-linear-to-br from-red-50 to-rose-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    {result.success ? (
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    ) : (
                      <AlertCircle className="w-10 h-10 text-red-600" />
                    )}
                    <div>
                      <p className={`font-bold text-xl ${
                        result.success ? "text-green-700" : "text-red-700"
                      }`}>
                        {result.success ? "✓ Ticket Verified" : "✗ Invalid Ticket"}
                      </p>
                      <p className="text-sm opacity-80">{result.message}</p>
                    </div>
                  </div>

                  {result.success && result.data && (
                    <div className="space-y-3 mt-4 pt-4 border-t border-green-200">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-green-600 opacity-70 text-xs uppercase font-semibold">Customer Name</p>
                          <p className="font-semibold text-slate-800 mt-1">
                            {result.data.booking?.name || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-green-600 opacity-70 text-xs uppercase font-semibold">Ticket Type</p>
                          <p className="font-semibold text-slate-800 mt-1">
                            {result.data.type?.name || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-green-600 opacity-70 text-xs uppercase font-semibold">Booking ID</p>
                          <p className="font-mono text-xs text-slate-600 mt-1 break-all">
                            {result.data.booking?.id?.slice(-8) || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-green-600 opacity-70 text-xs uppercase font-semibold">Status</p>
                          <span className="inline-flex px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-semibold mt-1">
                            {result.data.booking?.status || "CONFIRMED"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  <Button
                  text="Scan Another Ticket"
                  iconPosition="left"
                  icon={ScanLine}
                    onClick={handleReset}
                    className="flex-1  text-white py-3 rounded-xl font-bold transition-all shadow-lg"
                  />
                            
                  <button
                    onClick={() => {
                      setResult(null);
                      if (activeTab === "upload") {
                        clearUpload();
                      }
                    }}
                    className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Info Note */}
            {!result && (
              <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-center text-slate-500 text-xs flex items-center justify-center gap-2">
                  {activeTab === "camera" ? (
                    <>
                      <Camera className="w-3 h-3" />
                      {isMobile ? "Using back camera - Position QR code in frame" : "Point camera at QR code"}
                    </>
                  ) : (
                    <>
                      <Upload className="w-3 h-3" />
                      Upload image containing QR code (JPEG, PNG, WEBP)
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden div for client-side QR reading */}
      <div id="temp-qr-reader" style={{ display: 'none' }}></div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slide-in-from-bottom-4 {
          from {
            transform: translateY(1rem);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .slide-in-from-bottom-4 {
          animation: slide-in-from-bottom-4 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}