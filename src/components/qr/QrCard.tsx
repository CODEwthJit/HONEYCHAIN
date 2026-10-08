"use client";

import { QRCodeSVG } from "qrcode.react";
import { Download, ExternalLink, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QrCardProps {
  batchCode: string;
  lotNumber?: string;
  url: string;
}

export function QrCard({ batchCode, lotNumber, url }: QrCardProps) {
  const downloadQr = () => {
    const svg = document.getElementById(`qr-svg-${batchCode}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `honeychain-qr-${batchCode}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Card className="border border-stone-200 shadow-sm text-center">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-stone-900">
          Traceability QR Code
        </CardTitle>
        <p className="text-xs text-stone-500">Scan with any smartphone camera</p>
      </CardHeader>
      <CardContent className="p-6 pt-2 flex flex-col items-center space-y-4">
        {/* QR Code Graphic with honey amber border */}
        <div className="p-3 bg-white rounded-2xl border-2 border-amber-300 shadow-sm inline-block">
          <QRCodeSVG
            id={`qr-svg-${batchCode}`}
            value={url}
            size={180}
            level="H"
            includeMargin={true}
          />
        </div>

        <div className="space-y-1">
          <div className="text-sm font-bold text-stone-800">{batchCode}</div>
          {lotNumber && (
            <div className="text-xs text-stone-500 font-medium">Lot: {lotNumber}</div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 w-full">
          <Button
            size="sm"
            variant="outline"
            onClick={downloadQr}
            className="text-xs space-x-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PNG</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => window.print()}
            className="text-xs space-x-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Label</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

