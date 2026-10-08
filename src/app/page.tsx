import Link from "next/link";
import { 
  ShieldCheck, 
  QrCode, 
  FileCheck, 
  Layers, 
  ArrowRight, 
  ExternalLink 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrScannerModal } from "@/components/qr/QrScannerModal";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBF9] text-stone-900">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-stone-200/80 bg-gradient-to-b from-amber-50/50 via-white to-[#FBFBF9] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.1]">
              Honey Traceability from{" "}
              <span className="bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
                Hive to Table
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-stone-600 font-normal leading-relaxed">
              Every jar of honey has a story. HoneyChain creates an immutable digital passport for every batch—combining relational speed with tamper-evident cryptographic proofs to combat global honey adulteration.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <QrScannerModal />

              <Link href="/trace/HNY-2026-0001">
                <Button size="lg" className="space-x-2 text-base px-6 h-12 shadow-md">
                  <QrCode className="h-5 w-5" />
                  <span>Explore Authentic Batch Trace</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/verify-document">
                <Button size="lg" variant="outline" className="space-x-2 text-base px-6 h-12">
                  <FileCheck className="h-5 w-5 text-amber-600" />
                  <span>Verify Lab Certificate</span>
                </Button>
              </Link>
            </div>

            {/* Live Demo Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-stone-500">
              <span className="font-semibold text-stone-700">Quick Test Samples:</span>
              <Link href="/trace/HNY-2026-0001" className="underline hover:text-amber-600 font-mono">
                HNY-2026-0001 (Organic Wildflower)
              </Link>
              <span>•</span>
              <Link href="/trace/HNY-2026-0002" className="underline text-red-600 hover:text-red-700 font-mono">
                HNY-2026-0002 (Recalled Adulteration Batch)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* THE 4 TRUST TIERS PHILOSOPHY */}
      <section className="py-16 border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              The 4 Tiers of Truth
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Blockchain does not magically prove physical honey is pure. HoneyChain explicitly categorizes every claim so consumers know exactly what is verified.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border border-stone-200 bg-stone-50/50">
              <CardContent className="p-5 space-y-2">
                <Badge variant="outline" className="text-stone-600 bg-white">Tier 1</Badge>
                <h3 className="font-bold text-stone-900">Submitted</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Information self-declared by an actor (e.g., harvest date, floral declaration). May still contain errors.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-stone-200 bg-stone-50/50">
              <CardContent className="p-5 space-y-2">
                <Badge variant="outline" className="text-stone-600 bg-white">Tier 2</Badge>
                <h3 className="font-bold text-stone-900">Recorded</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Logged in PostgreSQL with authenticated user identity, organization ID, and timestamp.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-emerald-50/40">
              <CardContent className="p-5 space-y-2">
                <Badge variant="success">Tier 3</Badge>
                <h3 className="font-bold text-emerald-950">Verified</h3>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Attested by an accredited third-party Laboratory (e.g. EA-IRMS carbon isotope test, moisture &lt; 18%).
                </p>
              </CardContent>
            </Card>

            <Card className="border border-blue-200 bg-blue-50/40">
              <CardContent className="p-5 space-y-2">
                <Badge variant="blockchain">Tier 4</Badge>
                <h3 className="font-bold text-blue-950">Blockchain Anchored</h3>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Permanently etched into Arbitrum Sepolia smart contracts. Cannot be silently modified or censored.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS: THE 7 STAGES */}
      <section id="how-it-works" className="py-20 bg-[#FBFBF9] border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-stone-900">
              From Apiary to Shopping Cart
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              A verifiable chain-of-custody tracking the physical journey of every batch.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-sm space-y-3">
              <div className="text-3xl">🐝</div>
              <h3 className="text-lg font-bold text-stone-900">1. Beekeeper</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Logs apiary coordinates, harvest time, botanical origin, and initial raw weight.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-sm space-y-3">
              <div className="text-3xl">🔬</div>
              <h3 className="text-lg font-bold text-stone-900">2. Laboratory</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Performs isotope tests (C4 sugars), moisture, and HMF testing. Uploads certificate PDF and anchors SHA-256 hash.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-sm space-y-3">
              <div className="text-3xl">⚙️</div>
              <h3 className="text-lg font-bold text-stone-900">3. Processor</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Filters and settles honey below raw temperature limits (&lt; 45°C). Handles batch splits and blends via DAG lineage.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-sm space-y-3">
              <div className="text-3xl">🍯</div>
              <h3 className="text-lg font-bold text-stone-900">4. Packager & QR</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Bottles into glass jars, generates lot numbers, and assigns unique consumer QR code tokens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-stone-200 py-12 text-sm text-stone-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🍯</span>
            <span className="font-bold text-stone-900">HoneyChain</span>
            <span>• Open Source Blockchain Honey Traceability</span>
          </div>

          <div className="flex items-center space-x-6 text-xs font-medium">
            <Link href="/trace/HNY-2026-0001" className="hover:text-amber-600">
              Demo Batch
            </Link>
            <Link href="/verify-document" className="hover:text-amber-600">
              Document Verifier
            </Link>
            <Link href="/dashboard" className="hover:text-amber-600">
              Supply Portal
            </Link>
            <a
              href="https://sepolia.arbiscan.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-600 inline-flex items-center space-x-1"
            >
              <span>Arbiscan</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
