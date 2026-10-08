"use client";

import Link from "next/link";
import { useState } from "react";
import { ShieldCheck, QrCode, FileCheck, Layers, ChevronRight, Menu, X, Database } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <span className="text-xl">🍯</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-stone-900 group-hover:text-amber-600 transition-colors">
              HoneyChain
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-amber-700">
              Verifiable Traceability
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-stone-600">
          <Link href="/#how-it-works" className="hover:text-amber-600 transition-colors">
            How It Works
          </Link>
          <Link href="/trace/HNY-2026-0001" className="hover:text-amber-600 transition-colors flex items-center space-x-1">
            <QrCode className="h-4 w-4 text-amber-500" />
            <span>Sample QR Trace</span>
          </Link>
          <Link href="/verify-document" className="hover:text-amber-600 transition-colors flex items-center space-x-1">
            <FileCheck className="h-4 w-4 text-amber-500" />
            <span>Verify Certificate</span>
          </Link>
          <Link href="/dashboard" className="hover:text-amber-600 transition-colors flex items-center space-x-1">
            <Layers className="h-4 w-4 text-amber-500" />
            <span>Supply Portal</span>
          </Link>
        </nav>

        {/* Network & Portal Action */}
        <div className="hidden sm:flex items-center space-x-3">
          <Badge variant="blockchain" className="flex items-center space-x-1 px-2.5 py-1">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Arbitrum Sepolia</span>
          </Badge>

          <Link href="/dashboard">
            <Button size="sm" className="space-x-1">
              <span>Portal Login</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-600 hover:text-stone-900"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-stone-700 hover:text-amber-600"
          >
            How It Works
          </Link>
          <Link
            href="/trace/HNY-2026-0001"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-stone-700 hover:text-amber-600"
          >
            Sample QR Trace
          </Link>
          <Link
            href="/verify-document"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-stone-700 hover:text-amber-600"
          >
            Verify Certificate
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-stone-700 hover:text-amber-600"
          >
            Supply Portal
          </Link>
          <div className="pt-2">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full">Open Supply Portal</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

