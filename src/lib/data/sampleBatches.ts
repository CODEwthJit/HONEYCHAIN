import { TimelineStep } from "@/components/timeline/JourneyTimeline";

export interface SampleBatchData {
  batchCode: string;
  onChainBatchId: string;
  botanicalOrigin: string;
  harvestRegion: string;
  harvestDate: string;
  initialWeightGrams: number;
  currentWeightGrams: number;
  status: string;
  onChainStatus: string;
  isRecalled: boolean;
  recallReason?: string;
  recalledAt?: string;
  txHash: string;
  blockNumber: number;
  beekeeperName: string;
  beekeeperWallet: string;
  timeline: TimelineStep[];
  labReport: {
    fileName: string;
    moisturePercentage: number;
    hmfMgPerKg: number;
    c4SugarsPassed: boolean;
    pollenProfile: string;
    overallPass: boolean;
    sha256Hash: string;
    onChainTxHash: string;
  };
  packaging: {
    lotNumber: string;
    unitVolumeMl: number;
    unitCount: number;
    bestBeforeDate: string;
  };
}

export const SAMPLE_BATCHES: Record<string, SampleBatchData> = {
  "HNY-2026-0001": {
    batchCode: "HNY-2026-0001",
    onChainBatchId: "0x8f4c21b9a4c8e7651032fd98ba76543210abcdef9876543210fedcba12345678",
    botanicalOrigin: "Raw Wild Acacia & Forest Blossom",
    harvestRegion: "Nilgiri Biosphere Reserve, Western Ghats, India",
    harvestDate: "2026-03-12T08:30:00Z",
    initialWeightGrams: 500000, // 500 kg
    currentWeightGrams: 500000,
    status: "PACKAGED",
    onChainStatus: "CONFIRMED_ON_CHAIN",
    isRecalled: false,
    txHash: "0x92fa5371f6af3420845472f76c17ffefc6d284c8f26368e7966ecf7003b5ba1d",
    blockNumber: 18492041,
    beekeeperName: "Western Ghats Organic Apiaries",
    beekeeperWallet: "0xAd1758d04b1f9e16ee25fb6170BB7013121C0114",
    labReport: {
      fileName: "CoA-Eurofins-Nilgiri-HNY-2026-0001.pdf",
      moisturePercentage: 17.2,
      hmfMgPerKg: 11.4,
      c4SugarsPassed: true,
      pollenProfile: "Acacia modesta (76%), Syzygium cumini (18%), Eucalyptus (6%)",
      overallPass: true,
      sha256Hash: "0x8fae19b674823c91e0318ba8cd791192fa294be81132890a8fe5518b23c9811f",
      onChainTxHash: "0x92fa5371f6af3420845472f76c17ffefc6d284c8f26368e7966ecf7003b5ba1d",
    },
    packaging: {
      lotNumber: "LOT-PKG-2026-9042",
      unitVolumeMl: 500,
      unitCount: 1000,
      bestBeforeDate: "2028-03-12",
    },
    timeline: [
      {
        id: "step-1",
        stage: "HARVEST",
        title: "Hive Extraction & Batch Genesis",
        actorName: "Nilgiri Tribal Honey Co-operative",
        actorRole: "Certified Organic Beekeeper",
        actorWallet: "0xAd1758d04b1f9e16ee25fb6170BB7013121C0114",
        timestamp: "2026-03-12T08:30:00Z",
        location: "Kotagiri Apiary, Nilgiri Hills (Alt: 1,793m)",
        description: "Harvested unpasteurized raw forest honey from wild rock-bee hives and managed Apis cerana boxes. No smoke damage, zero synthetic chemical treatments.",
        details: {
          initialMass: "500 kg",
          floralSource: "Wild Acacia Blossom",
          ambientTemp: "21°C",
        },
        txHash: "0x92fa5371f6af3420845472f76c17ffefc6d284c8f26368e7966ecf7003b5ba1d",
        blockNumber: 18492041,
      },
      {
        id: "step-2",
        stage: "LAB_TEST",
        title: "Independent Laboratory Analysis & Isotope Testing",
        actorName: "Eurofins Food Analytical Services",
        actorRole: "Accredited Testing Laboratory (ISO/IEC 17025)",
        actorWallet: "0x3F2...91cB",
        timestamp: "2026-03-15T14:15:00Z",
        location: "Bangalore Testing Facility",
        description: "Comprehensive testing performed via EA-IRMS (Stable Carbon Isotope Ratio Mass Spectrometry) and HPLC. Confirmed negative for C4 corn/cane syrups, foreign enzymes, and antibiotic residues.",
        details: {
          moisture: "17.2% (< 20% standard)",
          hmfFreshness: "11.4 mg/kg (< 40 mg/kg)",
          c4Sugars: "Passed (No Adulteration)",
          antibiotics: "Zero Detected",
        },
        docName: "Certificate of Analysis #CoA-2026-0001.pdf",
        docHash: "0x8fae19b674823c91e0318ba8cd791192fa294be81132890a8fe5518b23c9811f",
        txHash: "0xb7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8",
        blockNumber: 18492890,
        isVerified: true,
      },
      {
        id: "step-3",
        stage: "PROCESSING",
        title: "Gentle Settling & Mesh Cold-Straining",
        actorName: "Purity Pure Honey Processing Ltd",
        actorRole: "Certified Food Processor",
        actorWallet: "0x88A...21DE",
        timestamp: "2026-03-18T10:00:00Z",
        location: "Coimbatore Processing Center",
        description: "Gravity settling tank extraction through a 200-micron stainless steel mesh. Temperature maintained strictly below 38°C to retain raw enzymes, natural diastase activity, and beneficial pollen grains.",
        details: {
          maxTemperature: "36.5°C (Raw Verified)",
          filtrationMesh: "200-micron",
          yieldRetained: "496 kg (99.2%)",
        },
        txHash: "0xc8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9",
        blockNumber: 18493410,
      },
      {
        id: "step-4",
        stage: "PACKAGING",
        title: "Bottling into Food-Grade Glass Jars & QR Token Generation",
        actorName: "Artisan Pack & Label Works",
        actorRole: "Licensed Packager",
        actorWallet: "0x44B...12FA",
        timestamp: "2026-03-20T16:00:00Z",
        location: "Chennai Packaging Hub",
        description: "Bottled into 1,000 amber-tinted UV-protective glass jars (500g each). Unique tamper-evident induction seals applied, linked to HoneyChain digital batch identities.",
        details: {
          lotNumber: "LOT-PKG-2026-9042",
          jarVolume: "500 grams",
          totalJars: "1,000 units",
          expiryDate: "March 2028",
        },
        txHash: "0xd9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0",
        blockNumber: 18494120,
      },
      {
        id: "step-5",
        stage: "DISTRIBUTION",
        title: "Climate-Controlled Cold Chain Transit & Retail Handover",
        actorName: "Speedy Logistics Distribution Co.",
        actorRole: "Cold Chain Distributor",
        actorWallet: "0x91F...73C0",
        timestamp: "2026-03-24T11:20:00Z",
        location: "Dispatched to Nature's Basket Gourmet Stores",
        description: "Shipment transported in temperature-controlled reefers (maintained between 18°C and 22°C). Custody verified and signed by retail fulfillment receiver.",
        details: {
          trackingNo: "TRK-IN-9812401",
          tempRange: "19.5°C - 21.0°C",
          status: "Delivered to Retail Shelf",
        },
        txHash: "0xe0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1",
        blockNumber: 18495010,
      },
    ],
  },
  "HNY-2026-0002": {
    batchCode: "HNY-2026-0002",
    onChainBatchId: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    botanicalOrigin: "Commercial Multi-Flora Blend",
    harvestRegion: "North Plains Apiary Zone, India",
    harvestDate: "2026-03-01T09:00:00Z",
    initialWeightGrams: 1000000, // 1000 kg
    currentWeightGrams: 1000000,
    status: "RECALLED",
    onChainStatus: "CONFIRMED_ON_CHAIN",
    isRecalled: true,
    recallReason: "Severe adulteration detected: EA-IRMS carbon isotope testing revealed 34% foreign C4 exogenous sugars (high-fructose corn syrup). Regulatory authority order #FSSAI-RC-981.",
    recalledAt: "2026-03-25T16:00:00Z",
    txHash: "0xfeeedcba9876543210abcdef0123456789abcdef0123456789abcdef01234567",
    blockNumber: 18496000,
    beekeeperName: "Commercial Valley Apiaries",
    beekeeperWallet: "0x999...0000",
    labReport: {
      fileName: "CoA-Adulteration-Fail-HNY-2026-0002.pdf",
      moisturePercentage: 23.5,
      hmfMgPerKg: 68.2,
      c4SugarsPassed: false,
      pollenProfile: "Low Pollen Density (< 5% natural count)",
      overallPass: false,
      sha256Hash: "0xdeadbeef123456789abcdef0123456789abcdef0123456789abcdef0123456789",
      onChainTxHash: "0xfa11ed0000000000000000000000000000000000000000000000000000000000",
    },
    packaging: {
      lotNumber: "LOT-PKG-RECALLED-02",
      unitVolumeMl: 500,
      unitCount: 2000,
      bestBeforeDate: "2027-03-01",
    },
    timeline: [
      {
        id: "step-1",
        stage: "HARVEST",
        title: "Apiary Harvest",
        actorName: "Commercial Valley Apiaries",
        actorRole: "Beekeeper",
        actorWallet: "0x999...0000",
        timestamp: "2026-03-01T09:00:00Z",
        location: "North Plains Agricultural Region",
        description: "Initial harvest recorded with declared 1,000 kg weight.",
        txHash: "0x1111111111111111111111111111111111111111111111111111111111111111",
        blockNumber: 18491000,
      },
      {
        id: "step-2",
        stage: "LAB_TEST",
        title: "Quality Testing — ADULTERATION DETECTED",
        actorName: "National Food Safety Testing Lab",
        actorRole: "Government Accredited Laboratory",
        actorWallet: "0x222...3333",
        timestamp: "2026-03-05T12:00:00Z",
        location: "Central Inspection Lab",
        description: "Lab testing failed across multiple safety standards. High moisture (23.5%), elevated HMF indicating heat damage, and 34% foreign C4 corn syrup detected.",
        details: {
          moisture: "23.5% (FAILED: > 20%)",
          hmfFreshness: "68.2 mg/kg (FAILED: > 40 mg/kg)",
          c4Sugars: "FAILED: 34% Adulterant Syrup",
          status: "FAILED ALL STANDARDS",
        },
        docName: "Inspection-Violation-Report.pdf",
        docHash: "0xdeadbeef123456789abcdef0123456789abcdef0123456789abcdef0123456789",
        txHash: "0x2222222222222222222222222222222222222222222222222222222222222222",
        blockNumber: 18492000,
        isVerified: true,
      },
    ],
  },
};

