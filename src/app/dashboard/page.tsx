"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  PlusCircle, 
  Layers, 
  FlaskConical, 
  Cog, 
  Package, 
  Truck, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink, 
  QrCode, 
  FileText,
  AlertOctagon,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SAMPLE_BATCHES, SampleBatchData } from "@/lib/data/sampleBatches";
import { calculateSha256, batchCodeToBytes32 } from "@/lib/crypto/hash";

type ActiveRole = "BEEKEEPER" | "LABORATORY" | "PROCESSOR" | "PACKAGER" | "DISTRIBUTOR" | "ADMIN";

export default function DashboardPage() {
  const [activeRole, setActiveRole] = useState<ActiveRole>("BEEKEEPER");
  const [batches, setBatches] = useState<SampleBatchData[]>(Object.values(SAMPLE_BATCHES));
  const [activeTab, setActiveTab] = useState<"catalog" | "action">("catalog");

  // Form states for creating a batch
  const [batchCodeInput, setBatchCodeInput] = useState(`HNY-2026-000${batches.length + 1}`);
  const [floraInput, setFloraInput] = useState("Wildflower & Jamun Blossom");
  const [regionInput, setRegionInput] = useState("Western Ghats Apiary, Coorg, India");
  const [weightKgInput, setWeightKgInput] = useState("450");
  const [beekeeperNameInput, setBeekeeperNameInput] = useState("Coorg Hill Honey Growers");

  // Lab testing form states
  const [selectedBatchCode, setSelectedBatchCode] = useState("HNY-2026-0001");
  const [moistureInput, setMoistureInput] = useState("17.8");
  const [hmfInput, setHmfInput] = useState("14.5");
  const [c4Passed, setC4Passed] = useState(true);

  // Admin recall states
  const [recallBatchCode, setRecallBatchCode] = useState("HNY-2026-0001");
  const [recallReasonInput, setRecallReasonInput] = useState("Pesticide residue exceeding EU regulatory limit (0.05 mg/kg).");

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // 1. Beekeeper creates batch
  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newBatch: SampleBatchData = {
      batchCode: batchCodeInput,
      onChainBatchId: batchCodeToBytes32(batchCodeInput),
      botanicalOrigin: floraInput,
      harvestRegion: regionInput,
      harvestDate: new Date().toISOString(),
      initialWeightGrams: parseInt(weightKgInput) * 1000,
      currentWeightGrams: parseInt(weightKgInput) * 1000,
      status: "CREATED",
      onChainStatus: "CONFIRMED_ON_CHAIN",
      isRecalled: false,
      txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      blockNumber: 18498200 + batches.length,
      beekeeperName: beekeeperNameInput,
      beekeeperWallet: "0x71C...b84F",
      labReport: {
        fileName: "Pending-Test.pdf",
        moisturePercentage: 0,
        hmfMgPerKg: 0,
        c4SugarsPassed: true,
        pollenProfile: "Pending Analysis",
        overallPass: false,
        sha256Hash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        onChainTxHash: "",
      },
      packaging: {
        lotNumber: `LOT-PKG-${batchCodeInput.replace("HNY-", "")}`,
        unitVolumeMl: 500,
        unitCount: parseInt(weightKgInput) * 2,
        bestBeforeDate: "2028-06-30",
      },
      timeline: [
        {
          id: `step-init-${Date.now()}`,
          stage: "HARVEST",
          title: "Raw Honey Harvest & On-Chain Batch Creation",
          actorName: beekeeperNameInput,
          actorRole: "Beekeeper",
          actorWallet: "0x71C...b84F",
          timestamp: new Date().toISOString(),
          location: regionInput,
          description: `Initial harvest of ${weightKgInput} kg harvested from ${floraInput}. Recorded in PostgreSQL and anchored to Arbitrum Sepolia.`,
          details: {
            harvestMass: `${weightKgInput} kg`,
            floralSource: floraInput,
          },
          txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
          blockNumber: 18498200 + batches.length,
        },
      ],
    };

    setBatches([newBatch, ...batches]);
    SAMPLE_BATCHES[newBatch.batchCode] = newBatch;
    showNotification(`Batch ${newBatch.batchCode} created and anchored on Arbitrum Sepolia!`);
    setActiveTab("catalog");
    setBatchCodeInput(`HNY-2026-000${batches.length + 2}`);
  };

  // 2. Admin recalls batch
  const handleRecallBatch = (e: React.FormEvent) => {
    e.preventDefault();
    setBatches(
      batches.map((b) => {
        if (b.batchCode === recallBatchCode) {
          const updated = {
            ...b,
            status: "RECALLED",
            isRecalled: true,
            recallReason: recallReasonInput,
            recalledAt: new Date().toISOString(),
          };
          SAMPLE_BATCHES[b.batchCode] = updated;
          return updated;
        }
        return b;
      })
    );
    showNotification(`Batch ${recallBatchCode} has been officially RECALLED.`);
    setActiveTab("catalog");
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Portal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-700">
              <Layers className="h-4 w-4" />
              <span>Supply Chain Operations</span>
            </div>
            <h1 className="text-3xl font-black text-stone-900 mt-1">
              HoneyChain Management Portal
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              Create batches, record laboratory tests, transform lots, and manage on-chain recall flags.
            </p>
          </div>

          {/* Role Simulator Switcher */}
          <div className="flex flex-col sm:items-end space-y-2">
            <span className="text-xs font-bold text-stone-500 uppercase">Simulate Role:</span>
            <div className="flex flex-wrap gap-1 bg-stone-200/80 p-1 rounded-xl">
              {(["BEEKEEPER", "LABORATORY", "PROCESSOR", "PACKAGER", "ADMIN"] as ActiveRole[]).map(
                (role) => (
                  <button
                    key={role}
                    onClick={() => setActiveRole(role)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      activeRole === role
                        ? "bg-amber-600 text-white shadow-sm"
                        : "text-stone-700 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                  >
                    {role}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Global Notification Toast */}
        {notification && (
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 text-sm font-semibold flex items-center space-x-2 shadow-sm animate-bounce">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* View Switcher Tabs */}
        <div className="flex items-center space-x-4 border-b border-stone-200 pb-2">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`text-sm font-bold pb-2 transition-colors ${
              activeTab === "catalog"
                ? "text-amber-700 border-b-2 border-amber-600"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            All Batches ({batches.length})
          </button>
          <button
            onClick={() => setActiveTab("action")}
            className={`text-sm font-bold pb-2 transition-colors ${
              activeTab === "action"
                ? "text-amber-700 border-b-2 border-amber-600"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            {activeRole === "BEEKEEPER" && "+ Register New Harvest"}
            {activeRole === "LABORATORY" && "+ Record Quality Test"}
            {activeRole === "ADMIN" && "⚠️ Trigger Batch Recall"}
            {activeRole !== "BEEKEEPER" && activeRole !== "LABORATORY" && activeRole !== "ADMIN" && "+ Role Actions"}
          </button>
        </div>

        {/* TAB 1: BATCH CATALOG */}
        {activeTab === "catalog" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map((b) => (
              <Card key={b.batchCode} className="border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3 border-b border-stone-100">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                      {b.batchCode}
                    </span>
                    {b.isRecalled ? (
                      <Badge variant="destructive">RECALLED</Badge>
                    ) : (
                      <Badge variant="success">{b.status}</Badge>
                    )}
                  </div>
                  <CardTitle className="text-base font-bold text-stone-900 mt-2">
                    {b.botanicalOrigin}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {b.harvestRegion}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5 space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-stone-600">
                    <div>
                      <span className="font-semibold text-stone-400 block text-[10px] uppercase">Weight</span>
                      <span className="font-bold text-stone-800">{(b.initialWeightGrams / 1000).toLocaleString()} kg</span>
                    </div>
                    <div>
                      <span className="font-semibold text-stone-400 block text-[10px] uppercase">Beekeeper</span>
                      <span className="truncate block font-medium text-stone-800">{b.beekeeperName}</span>
                    </div>
                  </div>

                  <div className="rounded-lg bg-stone-50 p-2.5 border border-stone-100 text-[11px] font-mono text-stone-600 break-all">
                    Tx: {b.txHash.slice(0, 18)}...
                  </div>

                  {b.isRecalled && (
                    <div className="rounded-lg bg-red-50 p-2.5 border border-red-200 text-red-800 text-[11px]">
                      <span className="font-bold">Recall Reason:</span> {b.recallReason}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                    <Link
                      href={`/trace/${b.batchCode}`}
                      className="inline-flex items-center space-x-1.5 font-bold text-amber-700 hover:text-amber-800"
                    >
                      <QrCode className="h-3.5 w-3.5" />
                      <span>View Public Trace</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* TAB 2: ACTIVE ROLE ACTION FORMS */}
        {activeTab === "action" && (
          <div className="max-w-2xl mx-auto">
            {/* BEEKEEPER: CREATE BATCH FORM */}
            {activeRole === "BEEKEEPER" && (
              <Card className="border border-stone-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-stone-900 flex items-center space-x-2">
                    <span>🐝</span>
                    <span>Register Raw Honey Harvest Batch</span>
                  </CardTitle>
                  <CardDescription>
                    Records genesis harvest parameters in PostgreSQL and prepares an Arbitrum Sepolia anchor.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateBatch} className="space-y-4 text-sm">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Batch Code</label>
                      <Input
                        value={batchCodeInput}
                        onChange={(e) => setBatchCodeInput(e.target.value)}
                        required
                        className="font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Botanical Floral Origin</label>
                      <Input
                        value={floraInput}
                        onChange={(e) => setFloraInput(e.target.value)}
                        placeholder="e.g. Raw Mustard & Eucalyptus Blossom"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Harvest Region & Apiary</label>
                      <Input
                        value={regionInput}
                        onChange={(e) => setRegionInput(e.target.value)}
                        placeholder="e.g. Sundarbans Mangrove Apiary, West Bengal"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Harvest Mass (kg)</label>
                        <Input
                          type="number"
                          value={weightKgInput}
                          onChange={(e) => setWeightKgInput(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Beekeeper Name</label>
                        <Input
                          value={beekeeperNameInput}
                          onChange={(e) => setBeekeeperNameInput(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button type="submit" className="w-full space-x-2">
                        <PlusCircle className="h-4 w-4" />
                        <span>Create & Anchor Batch</span>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* ADMIN: EMERGENCY RECALL FORM */}
            {activeRole === "ADMIN" && (
              <Card className="border-2 border-red-200 shadow-sm bg-red-50/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-red-900 flex items-center space-x-2">
                    <AlertOctagon className="h-5 w-5 text-red-600" />
                    <span>Emergency Batch Recall System</span>
                  </CardTitle>
                  <CardDescription>
                    Flags a contaminated or fraudulent batch. Immediately displays critical warning banners across all consumer QR pages.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRecallBatch} className="space-y-4 text-sm">
                    <div>
                      <label className="block text-xs font-bold text-red-900 uppercase mb-1">Target Batch to Recall</label>
                      <select
                        value={recallBatchCode}
                        onChange={(e) => setRecallBatchCode(e.target.value)}
                        className="w-full h-10 rounded-lg border border-red-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                      >
                        {batches.map((b) => (
                          <option key={b.batchCode} value={b.batchCode}>
                            {b.batchCode} — {b.botanicalOrigin}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-red-900 uppercase mb-1">Official Recall Justification</label>
                      <Input
                        value={recallReasonInput}
                        onChange={(e) => setRecallReasonInput(e.target.value)}
                        placeholder="e.g. Exogenous C4 sugar detected; regulatory order #982"
                        required
                        className="border-red-300"
                      />
                    </div>

                    <div className="pt-4">
                      <Button type="submit" variant="destructive" className="w-full space-x-2">
                        <AlertOctagon className="h-4 w-4" />
                        <span>Execute Emergency Recall</span>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* OTHER ROLES INFO */}
            {activeRole !== "BEEKEEPER" && activeRole !== "ADMIN" && (
              <Card className="border border-stone-200 shadow-sm p-6 text-center space-y-4">
                <div className="text-3xl">⚙️</div>
                <h3 className="text-lg font-bold text-stone-900">
                  {activeRole} Interface Active
                </h3>
                <p className="text-xs text-stone-600">
                  Select a batch from the catalog to record quality test metrics or processing lot splits.
                </p>
                <Button variant="outline" onClick={() => setActiveTab("catalog")}>
                  Return to Batch Catalog
                </Button>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

