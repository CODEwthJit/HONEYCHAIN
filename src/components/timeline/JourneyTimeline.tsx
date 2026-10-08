"use client";

import { CheckCircle2, AlertOctagon, ExternalLink, ShieldCheck, FileText, Clock, MapPin, Scale, Thermometer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatShortHash } from "@/lib/crypto/hash";

export interface TimelineStep {
  id: string;
  stage: "HARVEST" | "LAB_TEST" | "PROCESSING" | "PACKAGING" | "DISTRIBUTION";
  title: string;
  actorName: string;
  actorRole: string;
  actorWallet: string;
  timestamp: string;
  location?: string;
  description: string;
  details?: Record<string, string | number | boolean>;
  txHash?: string;
  blockNumber?: number;
  docHash?: string;
  docName?: string;
  docUrl?: string;
  isVerified?: boolean;
}

interface JourneyTimelineProps {
  steps: TimelineStep[];
  isRecalled?: boolean;
  recallReason?: string;
}

export function JourneyTimeline({ steps, isRecalled, recallReason }: JourneyTimelineProps) {
  const getStageColor = (stage: string) => {
    switch (stage) {
      case "HARVEST":
        return "bg-amber-500 text-white border-amber-600";
      case "LAB_TEST":
        return "bg-emerald-500 text-white border-emerald-600";
      case "PROCESSING":
        return "bg-blue-500 text-white border-blue-600";
      case "PACKAGING":
        return "bg-purple-500 text-white border-purple-600";
      case "DISTRIBUTION":
        return "bg-indigo-500 text-white border-indigo-600";
      default:
        return "bg-stone-500 text-white border-stone-600";
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "HARVEST":
        return "🐝";
      case "LAB_TEST":
        return "🔬";
      case "PROCESSING":
        return "⚙️";
      case "PACKAGING":
        return "🍯";
      case "DISTRIBUTION":
        return "🚚";
      default:
        return "📍";
    }
  };

  return (
    <div className="space-y-6">
      {/* Recall Warning Banner */}
      {isRecalled && (
        <div className="rounded-xl border-2 border-red-500 bg-red-50 p-6 shadow-md animate-pulse">
          <div className="flex items-start space-x-4">
            <AlertOctagon className="h-8 w-8 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xl font-black text-red-800 tracking-tight">
                ⚠️ CRITICAL RECALL NOTICE: THIS BATCH HAS BEEN RECALLED
              </h3>
              <p className="mt-1 text-sm font-medium text-red-700">
                This honey batch or one of its blending ancestors was flagged by quality inspection authorities.
              </p>
              {recallReason && (
                <div className="mt-3 rounded-lg bg-red-100 p-3 text-sm text-red-900 border border-red-200">
                  <span className="font-semibold">Reason:</span> {recallReason}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Timeline Steps */}
      <div className="relative border-l-2 border-amber-200 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
        {steps.map((step, idx) => (
          <div key={step.id} className="relative group">
            {/* Step Marker Node */}
            <div
              className={`absolute -left-[35px] sm:-left-[43px] top-1.5 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 shadow-sm ${getStageColor(
                step.stage
              )} transition-transform group-hover:scale-110`}
            >
              <span className="text-sm">{getStageIcon(step.stage)}</span>
            </div>

            {/* Step Content Card */}
            <Card className="border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5 sm:p-6 space-y-4">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                      Step {idx + 1} • {step.stage.replace("_", " ")}
                    </span>
                    <h4 className="text-lg font-bold text-stone-900">{step.title}</h4>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-stone-500">
                    <Clock className="h-3.5 w-3.5 text-stone-400" />
                    <span>{new Date(step.timestamp).toLocaleDateString("en-US", { dateStyle: "medium" })}</span>
                  </div>
                </div>

                {/* Actor & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-600 bg-stone-50/70 p-3 rounded-lg border border-stone-100">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-stone-800">Actor:</span>
                    <span>{step.actorName}</span>
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 bg-white">
                      {step.actorRole}
                    </Badge>
                  </div>
                  {step.location && (
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
                      <span className="truncate">{step.location}</span>
                    </div>
                  )}
                  <div className="sm:col-span-2 font-mono text-[11px] text-stone-500 flex items-center space-x-1 truncate">
                    <span>Wallet:</span>
                    <span className="text-stone-700 font-semibold">{step.actorWallet}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-stone-700 leading-relaxed">{step.description}</p>

                {/* Specific metrics grid */}
                {step.details && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    {Object.entries(step.details).map(([key, val]) => (
                      <div key={key} className="rounded-lg bg-amber-50/60 p-2.5 border border-amber-100">
                        <div className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                          {key.replace(/([A-Z])/g, " $1")}
                        </div>
                        <div className="text-sm font-semibold text-stone-900 mt-0.5">
                          {typeof val === "boolean" ? (val ? "Passed ✓" : "Failed ✕") : String(val)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Document & Hash Proof section */}
                {step.docHash && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-900">
                          {step.docName || "Laboratory Analysis Certificate"}
                        </span>
                      </div>
                      <Badge variant="success" className="text-[10px] space-x-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Hash Anchored</span>
                      </Badge>
                    </div>
                    <div className="text-[11px] font-mono text-emerald-800 break-all bg-white/70 p-2 rounded border border-emerald-100">
                      SHA-256: {step.docHash}
                    </div>
                  </div>
                )}

                {/* Blockchain Proof Badge */}
                {step.txHash && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
                    <div className="flex items-center space-x-1.5 text-stone-500 font-mono">
                      <span className="text-blue-600 font-bold">Arbitrum Sepolia:</span>
                      <span>Tx {formatShortHash(step.txHash, 6)}</span>
                      {step.blockNumber && <span className="text-stone-400">• Block #{step.blockNumber}</span>}
                    </div>
                    <a
                      href={`https://sepolia.arbiscan.io/tx/${step.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-amber-600 hover:text-amber-700 font-semibold text-xs"
                    >
                      <span>Verify on Arbiscan</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

