import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  FileText, 
  Layers, 
  ArrowLeft 
} from "lucide-react";
import { SAMPLE_BATCHES } from "@/lib/data/sampleBatches";
import { JourneyTimeline } from "@/components/timeline/JourneyTimeline";
import { DocumentVerifier } from "@/components/verifier/DocumentVerifier";
import { QrCard } from "@/components/qr/QrCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatShortHash } from "@/lib/crypto/hash";

interface PageProps {
  params: Promise<{ batchCode: string }>;
}

export const instant = false;

export async function generateStaticParams() {
  return Object.keys(SAMPLE_BATCHES).map((code) => ({
    batchCode: code,
  }));
}

export default async function TracePage({ params }: PageProps) {
  const { batchCode } = await params;
  const decodedBatchCode = decodeURIComponent(batchCode);
  const batch = SAMPLE_BATCHES[decodedBatchCode];

  if (!batch) {
    return (
      <div className="min-h-screen bg-[#FBFBF9] py-16 px-4">
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="text-4xl">🔍</div>
          <h1 className="text-2xl font-bold text-stone-900">Batch Not Found</h1>
          <p className="text-sm text-stone-600">
            Could not locate any registered batch with code <span className="font-mono font-semibold">{decodedBatchCode}</span>.
          </p>
          <div className="pt-4 space-y-2">
            <p className="text-xs text-stone-500 font-semibold">Try exploring an existing demo batch:</p>
            <div className="flex justify-center gap-3">
              <Link
                href="/trace/HNY-2026-0001"
                className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 hover:bg-amber-100"
              >
                HNY-2026-0001 (Organic Pure)
              </Link>
              <Link
                href="/trace/HNY-2026-0002"
                className="text-xs font-semibold text-red-700 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-100"
              >
                HNY-2026-0002 (Recalled)
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const publicTraceUrl = `${appUrl}/trace/${batch.batchCode}`;

  return (
    <div className="min-h-screen bg-[#FBFBF9] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-600 hover:text-amber-600"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <Badge variant="blockchain" className="space-x-1 text-xs">
            <span>Arbitrum Sepolia Anchored</span>
          </Badge>
        </div>

        {/* Batch Overview Header Card */}
        <div className="rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-100 pb-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                  {batch.batchCode}
                </span>
                {batch.isRecalled ? (
                  <Badge variant="destructive">RECALLED</Badge>
                ) : (
                  <Badge variant="success">CONFIRMED ON-CHAIN</Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">
                {batch.botanicalOrigin}
              </h1>
            </div>

            <div className="flex flex-col sm:items-end text-xs text-stone-500 space-y-1">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3.5 w-3.5 text-amber-600" />
                <span className="font-medium text-stone-700">{batch.harvestRegion}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3.5 w-3.5 text-stone-400" />
                <span>Harvested: {new Date(batch.harvestDate).toLocaleDateString("en-US", { dateStyle: "long" })}</span>
              </div>
              {batch.packaging && (
                <div className="font-mono text-stone-600 font-semibold">
                  Lot: {batch.packaging.lotNumber} ({batch.packaging.unitVolumeMl}g jars)
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl bg-stone-50 p-4 border border-stone-100">
              <span className="text-[10px] font-bold uppercase text-stone-400">Total Harvest Mass</span>
              <div className="text-lg font-bold text-stone-900 mt-0.5">
                {(batch.initialWeightGrams / 1000).toLocaleString()} kg
              </div>
            </div>

            <div className="rounded-xl bg-stone-50 p-4 border border-stone-100">
              <span className="text-[10px] font-bold uppercase text-stone-400">Lab Moisture</span>
              <div className="text-lg font-bold text-stone-900 mt-0.5">
                {batch.labReport.moisturePercentage}%
                <span className="text-xs font-normal text-stone-500 ml-1">
                  ({batch.labReport.moisturePercentage < 20 ? "Pass" : "Fail"})
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-stone-50 p-4 border border-stone-100">
              <span className="text-[10px] font-bold uppercase text-stone-400">C4 Sugar Isotope</span>
              <div className="text-lg font-bold text-stone-900 mt-0.5">
                {batch.labReport.c4SugarsPassed ? (
                  <span className="text-emerald-700">Pure ✓</span>
                ) : (
                  <span className="text-red-600">Adulterated ✕</span>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-stone-50 p-4 border border-stone-100">
              <span className="text-[10px] font-bold uppercase text-stone-400">Arbitrum Sepolia Block</span>
              <div className="text-lg font-bold font-mono text-blue-700 mt-0.5">
                #{batch.blockNumber}
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Layout: Left = Timeline, Right = QR & Verifier */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline Column (2 cols on large screen) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-stone-900">
                Supply-Chain Custody & Event Ledger
              </h2>
              <span className="text-xs text-stone-500">
                {batch.timeline.length} Confirmed Milestones
              </span>
            </div>

            <JourneyTimeline
              steps={batch.timeline}
              isRecalled={batch.isRecalled}
              recallReason={batch.recallReason}
            />
          </div>

          {/* Verification & QR Column (1 col on large screen) */}
          <div className="space-y-6">
            <QrCard
              batchCode={batch.batchCode}
              lotNumber={batch.packaging?.lotNumber}
              url={publicTraceUrl}
            />

            <DocumentVerifier
              expectedHash={batch.labReport?.sha256Hash}
              batchCode={batch.batchCode}
            />

            {/* Blockchain Receipt Card */}
            <Card className="border border-stone-200 shadow-sm bg-stone-50/50">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-stone-700">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  <span>On-Chain Cryptographic Receipt</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="text-stone-500">Genesis Transaction:</div>
                  <div className="font-mono text-[11px] text-stone-800 break-all bg-white p-2 rounded border border-stone-200">
                    {batch.txHash}
                  </div>
                </div>
                <a
                  href={`https://sepolia.arbiscan.io/tx/${batch.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  <span>Inspect on Arbiscan Block Explorer</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
