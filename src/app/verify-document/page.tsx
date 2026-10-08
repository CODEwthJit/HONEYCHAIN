import Link from "next/link";
import { ArrowLeft, Sparkles, FileCheck } from "lucide-react";
import { DocumentVerifier } from "@/components/verifier/DocumentVerifier";
import { SAMPLE_BATCHES } from "@/lib/data/sampleBatches";
import { Card, CardContent } from "@/components/ui/card";

export default function VerifyDocumentPage() {
  const sampleBatch = SAMPLE_BATCHES["HNY-2026-0001"];

  return (
    <div className="min-h-screen bg-[#FBFBF9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-600 hover:text-amber-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
            <FileCheck className="h-4 w-4" />
            <span>Independent Verification Tool</span>
          </div>
          <h1 className="text-3xl font-black text-stone-900 mt-1">
            Certificate & Document Verifier
          </h1>
          <p className="text-sm text-stone-600 mt-2">
            Calculate the SHA-256 fingerprint of any laboratory analysis document in your browser. HoneyChain compares the cryptographic hash against records stored on Arbitrum Sepolia.
          </p>
        </div>

        {/* Verifier Tool */}
        <DocumentVerifier
          expectedHash={sampleBatch.labReport.sha256Hash}
          batchCode={sampleBatch.batchCode}
        />

        {/* Explainer Box */}
        <Card className="border border-stone-200 bg-white">
          <CardContent className="p-6 space-y-3">
            <h3 className="font-bold text-stone-900 text-sm">
              How does cryptographic document hashing prevent forgery?
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              When a laboratory issues a test certificate, its full byte sequence produces a fixed 32-byte SHA-256 hash (e.g. <span className="font-mono text-stone-800">0x8fae...811f</span>). This hash is recorded inside a smart contract transaction on Arbitrum Sepolia.
            </p>
            <p className="text-xs text-stone-600 leading-relaxed">
              If an unauthorized entity alters the moisture percentage, dates, or test outcomes by even one single byte, the recalculated SHA-256 hash completely diverges, instantly exposing the document as tampered.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

