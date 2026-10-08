"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle, XCircle, FileText, ShieldAlert, Sparkles, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { calculateSha256 } from "@/lib/crypto/hash";

interface DocumentVerifierProps {
  expectedHash?: string;
  batchCode?: string;
}

export function DocumentVerifier({ expectedHash, batchCode }: DocumentVerifierProps) {
  const [file, setFile] = useState<File | null>(null);
  const [computedHash, setComputedHash] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsVerifying(true);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const hash = await calculateSha256(arrayBuffer);
      setComputedHash(hash);
    } catch (err) {
      console.error("Hash calculation failed", err);
    } finally {
      setIsVerifying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isMatch = expectedHash && computedHash ? expectedHash.toLowerCase() === computedHash.toLowerCase() : null;

  return (
    <Card className="border border-stone-200 shadow-sm overflow-hidden">
      <CardHeader className="bg-stone-50/50 border-b border-stone-100">
        <div className="flex items-center space-x-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="h-4 w-4" />
          <span>Client-Side Cryptographic Verifier</span>
        </div>
        <CardTitle className="text-xl font-bold text-stone-900">
          Verify Laboratory Certificate Authenticity
        </CardTitle>
        <CardDescription>
          Upload the laboratory report PDF to calculate its SHA-256 cryptographic digest locally in your browser and compare it with the blockchain-anchored hash.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {expectedHash && (
          <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Blockchain-Anchored Hash {batchCode ? `(${batchCode})` : ""}
              </span>
              <button
                onClick={() => copyToClipboard(expectedHash)}
                className="text-amber-700 hover:text-amber-900 text-xs flex items-center space-x-1"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <p className="font-mono text-xs text-amber-950 break-all select-all font-semibold">
              {expectedHash}
            </p>
          </div>
        )}

        {/* Upload Drop Zone */}
        <div className="relative border-2 border-dashed border-stone-300 rounded-xl p-8 text-center hover:border-amber-500 transition-colors bg-stone-50/30">
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-800">
                {file ? file.name : "Click to select or drag & drop certificate"}
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                PDF or image reports up to 10MB (Processed entirely in browser)
              </p>
            </div>
            {file && (
              <div className="text-xs text-stone-600 bg-white px-3 py-1 rounded-full border border-stone-200">
                File size: {(file.size / 1024).toFixed(1)} KB
              </div>
            )}
          </div>
        </div>

        {/* Verification Status Feedback */}
        {isVerifying && (
          <div className="text-center py-4 text-sm text-stone-600 animate-pulse">
            Computing cryptographic SHA-256 byte digest...
          </div>
        )}

        {computedHash && (
          <div className="space-y-4 pt-2">
            <div className="rounded-xl bg-stone-50 border border-stone-200 p-4 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Calculated File SHA-256 Digest:
              </span>
              <p className="font-mono text-xs text-stone-800 break-all font-semibold">
                {computedHash}
              </p>
            </div>

            {expectedHash && (
              <div>
                {isMatch ? (
                  <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50 p-4 flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-emerald-900">
                        Cryptographic Proof Verified ✓
                      </h4>
                      <p className="text-xs text-emerald-700 mt-0.5">
                        This document exactly matches the byte-for-byte fingerprint permanently recorded on Arbitrum Sepolia. The certificate is 100% genuine and unaltered.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border-2 border-red-500 bg-red-50 p-4 flex items-center space-x-3">
                    <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-red-900">
                        Cryptographic Mismatch — Warning ✕
                      </h4>
                      <p className="text-xs text-red-700 mt-0.5">
                        The calculated digest differs from the blockchain-anchored hash. This file may have been modified, re-saved, or tampered with.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

