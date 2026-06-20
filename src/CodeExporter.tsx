import React, { useState } from "react";
import { Copy, Check, Download, FileCode, CheckSquare, Sparkles } from "lucide-react";

interface CodeExporterProps {
  appsScriptUrl: string;
  botToken: string;
  botUsername: string;
  githubPagesUrl?: string;
  isDark?: boolean;
}

export default function CodeExporter({
  appsScriptUrl,
  botToken,
  botUsername,
  githubPagesUrl,
  isDark = false,
}: CodeExporterProps) {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<"html" | "react">("html");
  const [reactActiveTab, setReactActiveTab] = useState<"App.tsx" | "package.json" | "vite.config.ts" | "index.html" | "index.css" | "main.tsx" | "setup.sh" | "setup.ps1">("App.tsx");

  const cleanAppsScriptUrl = appsScriptUrl.trim() || "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";
  const cleanBotToken = botToken.trim() || "YOUR_TELEGRAM_BOT_TOKEN";
  const cleanBotUsername = botUsername.trim() || "ConbridgeConstructionSupplierBot";
  const cleanGithubPagesUrl = githubPagesUrl?.trim() || "";

  const packageJsonReactCode = `{
  "name": "conbridge-telegram-mini-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "framer-motion": "^11.5.4",
    "lucide-react": "^0.439.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.5.3",
    "vite": "^5.4.2"
  }
}`;

  const viteConfigReactCode = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
})`;

  const tailwindConfigReactCode = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

  const postcssConfigReactCode = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

  const mainTsxReactCode = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;

  const indexHtmlReactCode = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Conbridge Construction Material Directory</title>
    <!-- Telegram Web App SDK -->
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body class="bg-[var(--tg-theme-bg-color,#f3f4f6)] text-[var(--tg-theme-text-color,#1f2937)] font-sans antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

  const indexCssReactCode = `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
}

/* Telegram theme styles custom bindings */
:root {
  --tg-bg: var(--tg-theme-bg-color, #f3f4f6);
  --tg-text: var(--tg-theme-text-color, #1f2937);
  --tg-secondary-bg: var(--tg-theme-secondary-bg-color, #ffffff);
  --tg-hover: #242f3d;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 4px;
}
`;

  const appTsxReactCode = `import React, { useState, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  ShoppingBag, 
  Plus, 
  RefreshCw, 
  Send, 
  Check, 
  AlertTriangle,
  X,
  CreditCard,
  ChevronRight,
  Sparkles,
  Phone,
  User,
  Image,
  Truck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types
export interface Product {
  name: string;
  spec: string;
  price: string;
}

export interface Supplier {
  id: string;
  businessName: string;
  contactName: string;
  phone: string;
  telegramUsername: string;
  location: string;
  categories: string[];
  products: Product[];
  minOrder: string;
  delivery: "Yes" | "No" | "Negotiable";
  photoUrl: string;
  registeredAt: string;
  paymentStatus?: "unpaid" | "paid";
  paymentProvider?: "telebirr" | "cbe_birr" | "chapa" | "telegram_stars";
  paymentAmount?: string;
  paymentTxRef?: string;
}

const APPS_SCRIPT_URL = "${cleanAppsScriptUrl}";

export default function App() {
  const [activeTab, setActiveTab] = useState<"directory" | "register">("directory");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Registration Form States
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [photoUrl, setPhotoUrl] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [delivery, setDelivery] = useState<"Yes" | "No" | "Negotiable">("Yes");
  const [productsList, setProductsList] = useState<Product[]>([
    { name: "", spec: "", price: "" }
  ]);

  // Automated Payment Systems States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [pendingSupplier, setPendingSupplier] = useState<Supplier | null>(null);
  const [paymentProvider, setPaymentProvider] = useState<"telebirr" | "cbe_birr" | "chapa" | "telegram_stars">("telebirr");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [paymentStep, setPaymentStep] = useState<"select" | "processing" | "success" | "failed">("select");
  const [paymentTx, setPaymentTx] = useState("");

  const locations = ["Merkato", "Lebu", "CMC", "Bole", "Megenagna", "Saris", "Lideta", "Other"];
  const categoriesList = [
    "Cement", "Rebar/Steel", "Hollow Blocks", "Sand/Gravel", 
    "Tiles", "Paint", "Timber", "Sanitary", "Electrical", "Glass", "Other"
  ];

  useEffect(() => {
    // Initialize Telegram WebApp properties if applicable
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
    fetchLatestData();
  }, []);

  const fetchLatestData = async () => {
    setLoading(true);
    try {
      const res = await fetch(\`\${APPS_SCRIPT_URL}?action=getSuppliers\`);
      const payload = await res.json();
      if (payload && payload.status === "success") {
        setSuppliers(payload.data);
      }
    } catch (err) {
      console.warn("Failed to retrieve live suppliers, using demo data", err);
      // Fallback demo data
      setSuppliers([
        {
          id: "demo_1",
          businessName: "Kebede Cement Wholesalers",
          contactName: "Kebede Alene",
          phone: "0911223344",
          telegramUsername: "kebede_cement",
          location: "Merkato",
          categories: ["Cement", "Sand/Gravel"],
          products: [
            { name: "Derba OPC Cement (50kg Bag)", spec: "OPC 42.5R", price: "650 ETB" },
            { name: "Dangote PPC (50kg Bag)", spec: "PPC 32.5N", price: "610 ETB" }
          ],
          minOrder: "100 Bags",
          delivery: "Yes",
          photoUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80",
          registeredAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProductName = (index: number, val: string) => {
    const fresh = [...productsList];
    fresh[index].name = val;
    setProductsList(fresh);
  };

  const handleAddProductSpec = (index: number, val: string) => {
    const fresh = [...productsList];
    fresh[index].spec = val;
    setProductsList(fresh);
  };

  const handleAddProductPrice = (index: number, val: string) => {
    const fresh = [...productsList];
    fresh[index].price = val;
    setProductsList(fresh);
  };

  const addNewProductRow = () => {
    setProductsList([...productsList, { name: "", spec: "", price: "" }]);
  };

  const handleCategoryCheckbox = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const triggerSecureCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !contactName || !phone || !location) {
      alert("Please configure all required inputs");
      return;
    }
    if (selectedCategories.length === 0) {
      alert("Please select at least one material category");
      return;
    }

    const finalProducts = productsList.filter(p => p.name.trim() !== "");

    const newSupplier: Supplier = {
      id: "sup_" + Date.now(),
      businessName,
      contactName,
      phone,
      telegramUsername: telegramUsername.replace("@", ""),
      location,
      categories: selectedCategories,
      products: finalProducts,
      minOrder: minOrder || "Negotiable",
      delivery,
      photoUrl: photoUrl || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80",
      registeredAt: new Date().toISOString(),
      paymentStatus: "unpaid"
    };

    setPendingSupplier(newSupplier);
    setPaymentPhone(phone);
    setPaymentStep("select");
    setIsCheckoutOpen(true);
  };

  const processPaymentWebhooks = async (provider: "telebirr" | "cbe_birr" | "chapa" | "telegram_stars") => {
    if (!pendingSupplier) return;
    const txRef = \`TX_\${provider.toUpperCase()}_\${Math.floor(100000 + Math.random() * 900000)}\`;
    const amt = provider === "telegram_stars" ? "50 Stars 🌟" : "250.00 ETB";

    const updatedSupplier: Supplier = {
      ...pendingSupplier,
      paymentStatus: "paid",
      paymentProvider: provider,
      paymentAmount: amt,
      paymentTxRef: txRef,
      registeredAt: new Date().toISOString()
    };

    // Live Google App Script bridge connection
    if (APPS_SCRIPT_URL && !APPS_SCRIPT_URL.includes("YOUR")) {
      try {
        await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({
            action: "addSupplier",
            businessName: updatedSupplier.businessName,
            contactName: updatedSupplier.contactName,
            phone: updatedSupplier.phone,
            telegramUsername: updatedSupplier.telegramUsername,
            location: updatedSupplier.location,
            categories: JSON.stringify(updatedSupplier.categories),
            products: JSON.stringify(updatedSupplier.products),
            minOrder: updatedSupplier.minOrder,
            delivery: updatedSupplier.delivery,
            photoUrl: updatedSupplier.photoUrl,
            paymentStatus: "paid",
            paymentProvider: provider,
            paymentAmount: amt,
            paymentTxRef: txRef,
            registeredAt: updatedSupplier.registeredAt
          })
        });
      } catch (err) {
        console.warn("Expected background no-cors post callback", err);
      }
    }

    setSuppliers([updatedSupplier, ...suppliers]);
    setPaymentTx(txRef);
    setPaymentStep("success");

    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.showAlert) {
      window.Telegram.WebApp.showAlert(\`Premium Listing Activated! Invoice No: \${txRef}\`);
    }
  };

  const handleReset = () => {
    setBusinessName("");
    setContactName("");
    setPhone("");
    setTelegramUsername("");
    setLocation("");
    setSelectedCategories([]);
    setPhotoUrl("");
    setMinOrder("");
    setDelivery("Yes");
    setProductsList([{ name: "", spec: "", price: "" }]);
    setIsCheckoutOpen(false);
    setActiveTab("directory");
  };

  const filteredSuppliers = suppliers.filter(sup => {
    const matchesSearch =
      sup.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sup.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sup.categories.join(" ").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "" || sup.categories.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color,#f8fafc)] text-[var(--tg-theme-text-color,#0f172a)] flex flex-col antialiased select-none">
      
      {/* Top Banner & Tab Navigation */}
      <nav className="sticky top-0 z-40 bg-[var(--tg-theme-secondary-bg-color,#ffffff)] border-b border-gray-100 flex justify-around p-1 shadow-xs font-sans">
        <button
          onClick={() => setActiveTab("directory")}
          className={\`flex-1 py-3 text-xs font-semibold transition flex flex-col items-center gap-1.5 \${
            activeTab === "directory" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400 hover:text-gray-650"
          }\`}
        >
          <span>🔍</span>
          <span>Directory List</span>
        </button>
        <button
          onClick={() => setActiveTab("register")}
          className={\`flex-1 py-3 text-xs font-semibold transition flex flex-col items-center gap-1.5 \${
            activeTab === "register" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400 hover:text-gray-650"
          }\`}
        >
          <span>🏗️</span>
          <span>Register Store</span>
        </button>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 pb-24 relative font-sans">
        <AnimatePresence mode="wait">
          {activeTab === "directory" ? (
            <motion.div
              key="directory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Stat Card */}
              <div className="bg-[var(--tg-theme-secondary-bg-color,#ffffff)] rounded-3xl p-5 border border-gray-100 flex items-center justify-between shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="space-y-1 text-left">
                  <span className="text-[9px] font-bold text-blue-600 tracking-wider uppercase block">Construct-Bridge Index</span>
                  <h1 className="text-3xl font-extrabold tracking-tight flex items-baseline gap-1">
                    <span>{filteredSuppliers.length}</span>
                    <span className="text-xs font-semibold text-gray-400">Stores Live</span>
                  </h1>
                </div>
                <button
                  onClick={fetchLatestData}
                  disabled={loading}
                  className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-2xl flex items-center justify-center transition focus:outline-none cursor-pointer"
                >
                  <RefreshCw className={\`w-4 h-4 text-blue-600 \${loading ? "animate-spin" : ""}\`} />
                </button>
              </div>

              {/* Search Control */}
              <div className="bg-[var(--tg-theme-secondary-bg-color,#ffffff)] rounded-2xl p-4 border border-gray-100 space-y-3.5 shadow-xs">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search cement, rebar, steel, Merkato..."
                    className="w-full bg-gray-50 border border-gray-200/60 rounded-xl py-3 pl-10 pr-4 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition text-left"
                  />
                </div>

                {/* Categories filtering carousel */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={\`px-3 py-1.5 rounded-full text-[10px] font-bold shrink-0 transition-colors snap-start focus:outline-none cursor-pointer \${
                      selectedCategory === ""
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }\`}
                  >
                    🏗️ All Materials
                  </button>
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={\`px-3 py-1.5 rounded-full text-[10px] font-bold shrink-0 transition-colors snap-start focus:outline-none cursor-pointer \${
                        selectedCategory === cat
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-550 hover:bg-gray-200"
                      }\`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Suppliers list cards rendering */}
              <div className="space-y-4">
                {loading && (
                  <div className="py-20 text-center flex flex-col items-center gap-3">
                    <div className="w-7 h-7 rounded-full border-2 border-t-blue-600 border-blue-600/20 animate-spin" />
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Querying database...</span>
                  </div>
                )}

                {!loading && filteredSuppliers.length === 0 && (
                  <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-gray-200/80">
                    <span className="text-3xl block mb-2">🔎</span>
                    <h3 className="font-bold text-xs">No matching suppliers found</h3>
                    <p className="text-[10px] text-gray-400 mt-1 max-w-[200px] mx-auto leading-relaxed">
                      Try resetting your keywords or register a brand-new material provider card!
                    </p>
                  </div>
                )}

                {filteredSuppliers.map((sup) => (
                  <motion.div
                    layout
                    key={sup.id}
                    className="bg-[var(--tg-theme-secondary-bg-color,#ffffff)] rounded-3xl border border-gray-100 p-4 shadow-sm relative overflow-hidden text-left"
                  >
                    <div className="flex gap-3">
                      <img
                        src={sup.photoUrl}
                        alt="Store"
                        className="w-16 h-16 rounded-2xl object-cover border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="inline-block bg-blue-50/80 text-blue-600 text-[8.5px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                          {sup.categories.slice(0, 2).join(", ")}
                        </span>
                        <h2 className="text-xs font-black truncate mt-1 flex items-center gap-1">
                          <span>{sup.businessName}</span>
                          {sup.paymentStatus === "paid" ? (
                            <span className="bg-amber-100 text-amber-700 text-[7px] font-black tracking-widest uppercase px-1 py-0.5 rounded-full">
                              ⭐ PREMIUM
                            </span>
                          ) : (
                            <span className="text-blue-500 text-[10px]">✓</span>
                          )}
                        </h2>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400 font-semibold">
                          <span>👤 {sup.contactName}</span>
                          <span>📍 {sup.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Catalog list */}
                    {sup.products && sup.products.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-dashed border-gray-150 space-y-1.5">
                        <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Store Price list</h3>
                        <div className="space-y-1">
                          {sup.products.map((p, pIdx) => (
                            <div key={pIdx} className="flex justify-between bg-gray-50/60 p-2 rounded-xl text-[10.5px]">
                              <span className="font-semibold text-gray-700">{p.name} <span className="text-[9px] font-normal text-gray-400">({p.spec})</span></span>
                              <span className="font-extrabold text-blue-600">{p.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {sup.paymentStatus === "paid" && (
                      <div className="mt-2.5 p-2 bg-amber-50/60 border border-amber-100 rounded-xl text-[8px] font-mono leading-relaxed space-y-0.5 text-amber-950">
                        <div className="flex justify-between font-bold text-amber-900">
                          <span>💳 CERTIFIED PREMIUM ID</span>
                          <span>{sup.paymentAmount}</span>
                        </div>
                        <div className="flex justify-between text-amber-800/80">
                          <span>Gateway: {sup.paymentProvider?.toUpperCase()}</span>
                          <span>TxRef: {sup.paymentTxRef?.slice(0, 16)}</span>
                        </div>
                      </div>
                    )}

                    {/* Bottom Order Details */}
                    <div className="mt-3.5 pt-3.5 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div className="text-[10px]">
                        <span className="text-gray-400 block text-[8px] uppercase font-bold">Minimum Order Cap</span>
                        <span className="font-extrabold text-blue-950">{sup.minOrder}</span>
                      </div>
                      <a
                        href={\`https://t.me/\${sup.telegramUsername || "yourbotusername"}\`}
                        target="_blank"
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 px-4 text-[10px] font-bold tracking-wide text-center transition flex items-center gap-1 shrink-0"
                      >
                        <Send className="w-3 h-3" /> Contact Shop
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[var(--tg-theme-secondary-bg-color,#ffffff)] rounded-3xl p-5 border border-gray-100 shadow-sm text-left"
            >
              <h2 className="text-lg font-black tracking-tight text-blue-950">Supplier Card Registry</h2>
              <p className="text-[10.5px] text-gray-400 mt-1 leading-relaxed">
                Publish your store inventory catalog live to our Telegram channel and balance system instantly. Standard directory submission requires instant mobile wallet validation.
              </p>

              <form onSubmit={triggerSecureCheckout} className="space-y-4 mt-5">
                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Merkato Steel Distributors"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Contact Person *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Yohannes Hailu"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 0911223344"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Telegram Username</label>
                    <input
                      type="text"
                      value={telegramUsername}
                      onChange={(e) => setTelegramUsername(e.target.value)}
                      placeholder="e.g., @distributor"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Trading Area/Branch *</label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none focus:bg-white"
                    >
                      <option value="">Select Branch</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <label className="text-[9.5px] font-bold text-gray-400 uppercase tracking-widest pl-0.5 block">Sectors Offered *</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {categoriesList.slice(0, 9).map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => handleCategoryCheckbox(cat)}
                        className={\`p-2.5 rounded-xl border text-[10px] font-semibold text-center shrink-0 transition-colors cursor-pointer focus:outline-none \${
                          selectedCategories.includes(cat)
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                        }\`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Product Catalogue inputs */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center pr-0.5">
                    <label className="text-[9.5px] font-bold text-amber-600 uppercase tracking-widest block">Product Price Catalogue</label>
                    <button
                      type="button"
                      onClick={addNewProductRow}
                      className="text-blue-600 font-extrabold hover:underline text-[10.5px] flex items-center gap-0.5 focus:outline-none cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Core Row
                    </button>
                  </div>

                  {productsList.map((prod, idx) => (
                    <div key={idx} className="grid grid-cols-3 gap-2 bg-gray-50/50 p-2.5 rounded-2xl border border-gray-250/20">
                      <input
                        type="text"
                        placeholder="Material (e.g. Cement)"
                        value={prod.name}
                        onChange={(e) => handleAddProductName(idx, e.target.value)}
                        className="p-2 py-1.5 text-[10.5px] rounded-lg bg-white border border-gray-200 text-slate-800 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Spec (e.g. Muger)"
                        value={prod.spec}
                        onChange={(e) => handleAddProductSpec(idx, e.target.value)}
                        className="p-2 py-1.5 text-[10.5px] rounded-lg bg-white border border-gray-200 text-slate-800 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Price (e.g. 680 ETB)"
                        value={prod.price}
                        onChange={(e) => handleAddProductPrice(idx, e.target.value)}
                        className="p-2 py-1.5 text-[10.5px] rounded-lg bg-white border border-gray-200 text-slate-800 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Min Order Capacity</label>
                    <input
                      type="text"
                      value={minOrder}
                      onChange={(e) => setMinOrder(e.target.value)}
                      placeholder="e.g. 50 Packs / 20 Ton"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Store Delivery</label>
                    <select
                      value={delivery}
                      onChange={(e) => setDelivery(e.target.value as any)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none focus:bg-white"
                    >
                      <option value="Yes">Yes, customizable shipping</option>
                      <option value="No">No, pickup only</option>
                      <option value="Negotiable">Negotiable depending on MOQ</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Hero Photo URL</label>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="Provide image link..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl text-xs transition duration-200 flex items-center justify-center gap-1 shadow-md cursor-pointer block mt-3 focus:outline-none"
                >
                  <Sparkles className="w-4 h-4" /> Finalize Registration & Check out
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* CHECKOUT WEBHOOK DRAWER PORTAL */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex flex-col justify-end"
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="bg-[var(--tg-theme-secondary-bg-color,#ffffff)] rounded-t-[32px] p-5 pb-8 flex flex-col space-y-4 max-h-[90%] text-left font-sans"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto -mt-1.5 mb-2 shrink-0" />
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500">🛡️</span>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-800">Secure Direct Checkout</h3>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="text-[9px] font-bold text-red-500 bg-red-50/50 px-2.5 py-1 rounded-lg focus:outline-none cursor-pointer"
                >
                  Abort ✕
                </button>
              </div>

              <div className="overflow-y-auto space-y-4 max-h-[400px] pr-0.5">
                {paymentStep === "select" && (
                  <>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5">
                      <div className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Premium Listing Contract</div>
                      <h4 className="text-xs font-bold text-blue-950 mt-1">{pendingSupplier?.businessName}</h4>
                      <p className="text-[10px] text-gray-500 mt-1">Branch Area: {pendingSupplier?.location}</p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Select Wallet / Payment Network</span>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Telebirr */}
                        <button
                          type="button"
                          onClick={() => setPaymentProvider("telebirr")}
                          className={\`p-3 rounded-2xl border flex flex-col justify-between text-left relative focus:outline-none cursor-pointer \${
                            paymentProvider === "telebirr" ? "border-blue-500 bg-blue-50/20" : "border-gray-200"
                          }\`}
                        >
                          <span className="text-lg">📱</span>
                          <span className="text-[10px] font-bold text-blue-950 mt-2">Telebirr Wallet</span>
                          <span className="text-[9px] text-gray-400 font-mono">250.00 ETB</span>
                          {paymentProvider === "telebirr" && <span className="absolute top-2 right-2 text-blue-600 text-xs font-bold">✓</span>}
                        </button>

                        {/* CBE Birr */}
                        <button
                          type="button"
                          onClick={() => setPaymentProvider("cbe_birr")}
                          className={\`p-3 rounded-2xl border flex flex-col justify-between text-left relative focus:outline-none cursor-pointer \${
                            paymentProvider === "cbe_birr" ? "border-indigo-500 bg-indigo-50/20" : "border-gray-200"
                          }\`}
                        >
                          <span className="text-lg">🏦</span>
                          <span className="text-[10px] font-bold text-blue-950 mt-2">CBE Birr</span>
                          <span className="text-[9px] text-gray-400 font-mono">250.00 ETB</span>
                          {paymentProvider === "cbe_birr" && <span className="absolute top-2 right-2 text-indigo-600 text-xs font-bold">✓</span>}
                        </button>

                        {/* Chapa */}
                        <button
                          type="button"
                          onClick={() => setPaymentProvider("chapa")}
                          className={\`p-3 rounded-2xl border flex flex-col justify-between text-left relative focus:outline-none cursor-pointer \${
                            paymentProvider === "chapa" ? "border-emerald-500 bg-emerald-50/20" : "border-gray-200"
                          }\`}
                        >
                          <span className="text-lg">💳</span>
                          <span className="text-[10px] font-bold text-blue-950 mt-2">Chapa API</span>
                          <span className="text-[9px] text-gray-400 font-mono">250.05 ETB</span>
                          {paymentProvider === "chapa" && <span className="absolute top-2 right-2 text-emerald-600 text-xs font-bold">✓</span>}
                        </button>

                        {/* Telegram Stars */}
                        <button
                          type="button"
                          onClick={() => setPaymentProvider("telegram_stars")}
                          className={\`p-3 rounded-2xl border flex flex-col justify-between text-left relative focus:outline-none cursor-pointer \${
                            paymentProvider === "telegram_stars" ? "border-amber-500 bg-amber-50/20" : "border-gray-200"
                          }\`}
                        >
                          <span className="text-lg">🌟</span>
                          <span className="text-[10px] font-bold text-blue-950 mt-2">Telegram Stars</span>
                          <span className="text-[9px] text-gray-400 font-mono">50 Stars</span>
                          {paymentProvider === "telegram_stars" && <span className="absolute top-2 right-2 text-amber-500 text-xs font-bold">✓</span>}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-0.5 block">
                        {paymentProvider === "telegram_stars" ? "TG Username" : "Confirmation Phone / Account identifier"}
                      </label>
                      <input
                        type="text"
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        placeholder="e.g. 0911223344"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:bg-white"
                      />
                    </div>

                    <button
                      onClick={() => setPaymentStep("processing")}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl text-xs transition block text-center focus:outline-none cursor-pointer"
                    >
                      Authorize secure gateway checkout
                    </button>
                  </>
                )}

                {paymentStep === "processing" && (
                  <div className="py-8 text-center flex flex-col items-center gap-4 text-slate-800">
                    <div className="w-8 h-8 rounded-full border-2 border-t-amber-500 border-amber-500/20 animate-spin" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-blue-950 uppercase select-text">Waiting Webhook Deposit Clearance</h4>
                      <p className="text-[10px] text-gray-500 max-w-[240px] leading-relaxed mx-auto select-text">
                        We sent a secure validation request to <span className="font-bold">{paymentPhone}</span>. Approve on your phone or simulate gateway confirmation below.
                      </p>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl w-full text-center space-y-2 mt-2">
                      <span className="text-[9px] font-bold text-amber-700 uppercase block tracking-wider font-sans">⚡ Integration Webhook Simulator</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => processPaymentWebhooks(paymentProvider)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[9.5px] font-bold py-2 rounded-xl transition focus:outline-none cursor-pointer"
                        >
                          Simulate Success
                        </button>
                        <button
                          onClick={() => setPaymentStep("failed")}
                          className="bg-red-600 hover:bg-red-700 text-white text-[9.5px] font-bold py-2 rounded-xl transition focus:outline-none cursor-pointer"
                        >
                          Simulate Fail
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {paymentStep === "success" && (
                  <div className="py-6 text-center flex flex-col items-center gap-4 text-slate-800">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-650 rounded-full flex items-center justify-center text-xl font-bold">✓</div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-emerald-600 uppercase font-sans">Automated Checkout Confirmed!</h4>
                      <p className="text-[10px] text-gray-500 max-w-[240px] mx-auto leading-relaxed select-text">
                        Secure transaction receipt compiled under reference <span className="font-mono font-bold text-gray-700">{paymentTx}</span>.
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 w-full space-y-2 font-mono text-[9px] select-text">
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-sans">Merchant:</span>
                        <span className="font-bold text-slate-800">Conbridge Bot Platform</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-sans">Licence Client:</span>
                        <span className="font-bold text-slate-800">{pendingSupplier?.businessName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-sans">Clearing Network:</span>
                        <span className="font-bold text-slate-800 uppercase">{paymentProvider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-sans">Ref Code:</span>
                        <span className="font-bold text-slate-800">{paymentTx}</span>
                      </div>
                      <div className="flex justify-between border-t border-dashed border-gray-200 pt-2 font-bold text-[10px] text-amber-600">
                        <span className="font-sans font-bold">Total cleared:</span>
                        <span>{paymentProvider === "telegram_stars" ? "50 Stars 🌟" : "250.00 ETB"}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleReset}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl text-xs transition focus:outline-none cursor-pointer"
                    >
                      Publish Premium Directory Listing 🎉
                    </button>
                  </div>
                )}

                {paymentStep === "failed" && (
                  <div className="py-6 text-center flex flex-col items-center gap-4 text-slate-800">
                    <div className="w-12 h-12 bg-red-50 text-red-650 rounded-full flex items-center justify-center text-xl font-bold">✕</div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-red-500 uppercase font-sans">Clearing Aborted / Rejected</h4>
                      <p className="text-[10px] text-gray-500 max-w-[240px] mx-auto leading-relaxed">
                        Transaction verification failed or rejected by mobile wallet carrier. A cleared deposit is required to publish directory cards.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 w-full pt-2">
                      <button
                        onClick={() => setPaymentStep("select")}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-xl text-xs transition focus:outline-none cursor-pointer"
                      >
                        🔄 Retry checkout
                      </button>
                      <button
                        onClick={() => setIsCheckoutOpen(false)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-xs transition focus:outline-none cursor-pointer"
                      >
                        Cancel Listing
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}`;


  const miniAppHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ethiopian Construction Supplier Directory</title>
  <!-- Telegram Web App SDK -->
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Custom Font -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
    }
  </style>
</head>
<body class="bg-[var(--tg-theme-bg-color,#f3f4f6)] text-[var(--tg-theme-text-color,#1f2937)] transition-colors duration-200">

  <!-- Floating Navigation Header -->
  <nav class="sticky top-0 z-50 bg-[var(--tg-theme-secondary-bg-color,#ffffff)] shadow-sm border-b border-gray-200/50 flex justify-around py-3 px-4">
    <button id="tab-dir" onclick="switchTab('directory')" class="flex flex-col items-center flex-1 py-1 font-medium text-xs text-blue-600 border-b-2 border-blue-600 transition-all duration-150">
      <span class="text-lg leading-none mb-1">🔍</span>
      <span>Directory</span>
    </button>
    <button id="tab-reg" onclick="switchTab('register')" class="flex flex-col items-center flex-1 py-1 font-medium text-xs text-gray-500 hover:text-gray-900 border-b-2 border-transparent transition-all duration-150">
      <span class="text-lg leading-none mb-1">🏗️</span>
      <span>Register Supplier</span>
    </button>
  </nav>

  <main class="max-w-md mx-auto p-4 pb-20">
    
    <!-- URL Configuration Warning notice -->
    <div id="setup-warning" class="hidden bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 space-y-1.5 mb-4">
      <div class="font-bold flex items-center gap-1">⚠️ Demo Mode Active (Google Sheets Not Synced)</div>
      <p class="leading-relaxed">Your real Telegram WebApp is loading but hasn't received your Google Sheets live backend address. To fix this:</p>
      <ol class="list-decimal pl-4 space-y-1 font-semibold text-amber-900">
        <li>Open the builder sidebar of this developer panel.</li>
        <li>Paste your real Google Apps Script web app URL.</li>
        <li>Copy this updated HTML and replace your repository's <code>index.html</code> code.</li>
      </ol>
    </div>
    
    <!-- BRAND PREMIUM HERO CARD (Telegram Wallet Style) -->
    <div class="p-5 rounded-[24px] text-center border relative overflow-hidden flex flex-col justify-between items-center transition-all bg-[var(--tg-theme-secondary-bg-color,#ffffff)] border-gray-200/50 shadow-xs mb-4">
      <!-- Ambient light decorative shapes -->
      <div class="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-20 h-20 bg-teal-500/10 rounded-full blur-xl pointer-events-none"></div>

      <span class="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1.5 mb-2.5">
        <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
        Material Balance System
      </span>

      <div class="my-1.5 text-center">
        <div class="text-4xl font-extrabold tracking-tight flex items-center justify-center gap-1.5 text-[var(--tg-theme-text-color,#1e293b)]">
          <span class="text-3xl">💎</span>
          <span id="dir-total-partners" class="font-sans font-black">3</span>
          <span class="text-[9px] font-black bg-blue-500/15 text-blue-600 rounded-full px-2 py-0.5 uppercase tracking-wide ml-1">
            Live
          </span>
        </div>
        <div class="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
          Total Verified Supply Cards
        </div>
      </div>

      <!-- Micro metrics indicators -->
      <div class="w-full grid grid-cols-2 gap-4 mt-3 border-y border-dashed border-gray-200 py-2.5">
        <div>
          <div class="text-[9px] text-gray-400 uppercase font-semibold">Premium Sectors</div>
          <div class="text-xs font-black text-[var(--tg-theme-text-color,#1e293b)] mt-0.5">
            🧱 Multi-Material
          </div>
        </div>
        <div>
          <div class="text-[9px] text-gray-400 uppercase font-semibold">Verified Scope</div>
          <div class="text-xs font-black text-[var(--tg-theme-text-color,#1e293b)] mt-0.5">
            💯 100% Secure
          </div>
        </div>
      </div>

      <!-- Quick action bar -->
      <div class="w-full grid grid-cols-3 gap-2 mt-3 pt-1">
        <button type="button" onclick="switchTab('register')" class="flex flex-col items-center gap-1 focus:outline-none cursor-pointer">
          <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all">
            ➕
          </div>
          <span class="text-[9px] font-bold text-gray-500">Add partner</span>
        </button>

        <button type="button" onclick="document.getElementById('dir-search').focus()" class="flex flex-col items-center gap-1 focus:outline-none cursor-pointer">
          <div class="w-8 h-8 rounded-full bg-gray-100 text-blue-600 flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
            🔍
          </div>
          <span class="text-[9px] font-bold text-gray-500">Search</span>
        </button>

        <button type="button" onclick="fetchLatestData()" class="flex flex-col items-center gap-1 focus:outline-none cursor-pointer">
          <div class="w-8 h-8 rounded-full bg-gray-100 text-teal-600 flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
            🔄
          </div>
          <span class="text-[9px] font-bold text-gray-500">Sync Sheets</span>
        </button>
      </div>
    </div>

    <!-- DIRECTORY TAB VIEW -->
    <section id="view-directory" class="space-y-4">
      <!-- Search & Filters Container -->
      <div class="bg-[var(--tg-theme-secondary-bg-color,#ffffff)] rounded-xl p-4 shadow-sm space-y-3">
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Search Suppliers</label>
        <div class="relative">
          <input type="text" id="dir-search" oninput="filterSuppliers()" placeholder="Search rebar, cement, tile, locations..." 
            class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <span class="absolute left-3 top-3 text-gray-400 text-sm">🔍</span>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category Filter</label>
          <input type="hidden" id="dir-category-filter" value="">
          <div id="category-chips" class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x -mx-1 px-1">
            <button type="button" onclick="selectCategoryChip('', this)" class="category-chip shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer snap-start bg-blue-600 text-white shadow-sm font-semibold">
              🏗️ All
            </button>
            <button type="button" onclick="selectCategoryChip('Cement', this)" class="category-chip shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer snap-start bg-gray-100 text-gray-600 hover:bg-gray-200">
              🧱 Cement
            </button>
            <button type="button" onclick="selectCategoryChip('Rebar/Steel', this)" class="category-chip shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer snap-start bg-gray-100 text-gray-600 hover:bg-gray-200">
              ⛓️ Rebar/Steel
            </button>
            <button type="button" onclick="selectCategoryChip('Hollow Blocks', this)" class="category-chip shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer snap-start bg-gray-100 text-gray-600 hover:bg-gray-200">
              🧱 Hollow Blocks
            </button>
            <button type="button" onclick="selectCategoryChip('Sand/Gravel', this)" class="category-chip shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer snap-start bg-gray-100 text-gray-600 hover:bg-gray-200">
              🏜️ Sand/Gravel
            </button>
            <button type="button" onclick="selectCategoryChip('Tiles', this)" class="category-chip shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer snap-start bg-gray-100 text-gray-600 hover:bg-gray-200">
              📏 Tiles
            </button>
            <button type="button" onclick="selectCategoryChip('Paint', this)" class="category-chip shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer snap-start bg-gray-100 text-gray-600 hover:bg-gray-200">
              🎨 Paint
            </button>
            <button type="button" onclick="selectCategoryChip('Timber', this)" class="category-chip shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer snap-start bg-gray-100 text-gray-600 hover:bg-gray-200">
              🪵 Timber
            </button>
            <button type="button" onclick="selectCategoryChip('Sanitary', this)" class="category-chip shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer snap-start bg-gray-100 text-gray-600 hover:bg-gray-200">
              🚽 Sanitary
            </button>
            <button type="button" onclick="selectCategoryChip('Electrical', this)" class="category-chip shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer snap-start bg-gray-100 text-gray-600 hover:bg-gray-200">
              ⚡ Electrical
            </button>
            <button type="button" onclick="selectCategoryChip('Glass', this)" class="category-chip shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer snap-start bg-gray-100 text-gray-600 hover:bg-gray-200">
              🪟 Glass
            </button>
            <button type="button" onclick="selectCategoryChip('Other', this)" class="category-chip shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer snap-start bg-gray-100 text-gray-600 hover:bg-gray-200">
              📦 Other
            </button>
          </div>
        </div>
      </div>

      <!-- Live Search Status -->
      <div class="flex justify-between items-center px-1">
        <span class="text-xs text-gray-500 font-medium" id="dir-results-count">Showing 3 suppliers</span>
        <button onclick="fetchLatestData()" class="text-xs text-blue-600 hover:underline flex items-center gap-1">
          🔄 Refresh
        </button>
      </div>

      <!-- Suppliers List -->
      <div id="dir-list" class="space-y-4">
        <!-- Static Demo Data (Will be dynamically fetched or populated) -->
        <div class="bg-[var(--tg-theme-secondary-bg-color,#ffffff)] rounded-xl p-4 shadow-sm border border-gray-100/50 space-y-3">
          <div class="flex justify-between items-start">
            <div>
              <span class="inline-block bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">Cement, Sand/Gravel</span>
              <h2 class="text-base font-semibold text-gray-800 mt-1">Kebede Cement Wholesalers</h2>
              <p class="text-xs text-gray-400">👤 Kebede Alene • 📞 0911223344</p>
            </div>
            <span class="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">📍 Merkato</span>
          </div>
          <div class="border-t border-dashed border-gray-100 pt-3">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Featured Products:</h3>
            <div class="grid grid-cols-1 gap-2 text-xs">
              <div class="flex justify-between bg-gray-50/50 p-2 rounded">
                <span>Derba OPC Cement (50kg Bag)</span>
                <span class="font-semibold text-blue-600">650 ETB</span>
              </div>
              <div class="flex justify-between bg-gray-50/50 p-2 rounded">
                <span>Dangote PPC (50kg Bag)</span>
                <span class="font-semibold text-blue-600">610 ETB</span>
              </div>
            </div>
          </div>
          <div class="flex gap-2 pt-2">
            <span class="text-xs text-gray-500 flex-1">📦 MOQ: 100 Bags • 🚛 Delivery: Yes</span>
            <a href="https://t.me/kebede_cement" target="_blank" class="bg-blue-600 text-white rounded-lg px-4 py-1.5 text-xs font-semibold text-center hover:bg-blue-700 transition">Telegram Contact</a>
          </div>
        </div>
      </div>
    </section>

    <!-- REGISTER VIEW -->
    <section id="view-register" class="hidden space-y-4">
      <div class="bg-[var(--tg-theme-secondary-bg-color,#ffffff)] rounded-xl p-5 shadow-sm border border-gray-100/50">
        <h2 class="text-lg font-bold text-gray-800 mb-1">Supplier Registration</h2>
        <p class="text-xs text-gray-500 mb-6">Create your digital trade card and catalogue for free. Submissions are synced with Google Sheets.</p>

        <form id="supplier-form" onsubmit="handleFormSubmit(event)" class="space-y-5">
          <!-- Business Name -->
          <div>
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Business Name *</label>
            <input type="text" id="reg-biz-name" required placeholder="e.g. Conbridge Rebar & Steel Traders" 
              class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
          </div>

          <!-- Contact Person -->
          <div>
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Contact Person Name *</label>
            <input type="text" id="reg-contact-name" required placeholder="e.g. Yohannes Hailu" 
              class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
          </div>

          <!-- Phone Number -->
          <div>
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Phone Number (Ethiopia) *</label>
            <input type="tel" id="reg-phone" required placeholder="e.g. 0911223344" 
              class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
          </div>

          <!-- Telegram Username -->
          <div>
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Telegram @Username (Optional)</label>
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-gray-400 text-sm">@</span>
              <input type="text" id="reg-tg" placeholder="username" 
                class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-7 pr-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            </div>
          </div>

          <!-- Location -->
          <div>
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Conbridge Trading Area/Branch *</label>
            <select id="reg-location" required 
              class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="">Choose Area</option>
              <option value="Merkato">Merkato</option>
              <option value="Lebu">Lebu</option>
              <option value="CMC">CMC</option>
              <option value="Bole">Bole</option>
              <option value="Megenagna">Megenagna</option>
              <option value="Saris">Saris</option>
              <option value="Lideta">Lideta</option>
              <option value="Other">Other Area</option>
            </select>
          </div>

          <!-- Categories (Multi-select) -->
          <div>
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Product Categories (Select All That Apply) *</label>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <label class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input type="checkbox" name="category" value="Cement" class="rounded text-blue-600">
                <span>Cement</span>
              </label>
              <label class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input type="checkbox" name="category" value="Rebar/Steel" class="rounded text-blue-600">
                <span>Rebar/Steel</span>
              </label>
              <label class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input type="checkbox" name="category" value="Hollow Blocks" class="rounded text-blue-600">
                <span>Hollow Blocks</span>
              </label>
              <label class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input type="checkbox" name="category" value="Sand/Gravel" class="rounded text-blue-600">
                <span>Sand/Gravel</span>
              </label>
              <label class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input type="checkbox" name="category" value="Tiles" class="rounded text-blue-600">
                <span>Tiles</span>
              </label>
              <label class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input type="checkbox" name="category" value="Paint" class="rounded text-blue-600">
                <span>Paint</span>
              </label>
              <label class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input type="checkbox" name="category" value="Timber" class="rounded text-blue-600">
                <span>Timber</span>
              </label>
              <label class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input type="checkbox" name="category" value="Sanitary" class="rounded text-blue-600">
                <span>Sanitary</span>
              </label>
              <label class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input type="checkbox" name="category" value="Electrical" class="rounded text-blue-600">
                <span>Electrical</span>
              </label>
              <label class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input type="checkbox" name="category" value="Glass" class="rounded text-blue-600">
                <span>Glass</span>
              </label>
            </div>
          </div>

          <!-- Product 1 -->
          <div class="border-t border-gray-100 pt-4">
            <h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Top Product #1</h3>
            <div class="grid grid-cols-1 gap-2.5">
              <input type="text" id="prod1-name" required placeholder="Product Name (e.g. Derba Cement PPC)" class="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <div class="grid grid-cols-2 gap-2">
                <input type="text" id="prod1-spec" placeholder="Specification (e.g. 50Kg Bag)" class="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <input type="text" id="prod1-price" required placeholder="Price per unit (e.g. 620 ETB)" class="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none">
              </div>
            </div>
          </div>

          <!-- Product 2 -->
          <div class="border-t border-gray-100 pt-4">
            <h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Top Product #2 (Optional)</h3>
            <div class="grid grid-cols-1 gap-2.5">
              <input type="text" id="prod2-name" placeholder="Product Name (e.g. Dangote OPC Cement)" class="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <div class="grid grid-cols-2 gap-2">
                <input type="text" id="prod2-spec" placeholder="Specification" class="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <input type="text" id="prod2-price" placeholder="Price per unit" class="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none">
              </div>
            </div>
          </div>

          <!-- MOQ & Delivery -->
          <div class="border-t border-gray-100 pt-4 grid grid-cols-2 gap-3 pb-2">
            <div>
              <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">MOQ *</label>
              <input type="text" id="reg-moq" required placeholder="e.g., 100 bags / 5 tons" 
                class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Delivery Available? *</label>
              <select id="reg-delivery" required 
                class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Negotiable">Negotiable</option>
              </select>
            </div>
          </div>

          <!-- Photo upload mock (base64 or reference URL) -->
          <div>
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Store / Catalogue Photo Link (Optional)</label>
            <input type="url" id="reg-photo-url" placeholder="Paste an image URL" 
              class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
          </div>

          <button type="submit" id="submit-btn" 
            class="w-full bg-blue-600 text-white font-semibold rounded-xl py-3 text-sm shadow hover:bg-blue-700 transition duration-150 transform active:scale-95">
            Register Business & Create Card
          </button>
        </form>

        <!-- Dynamic Success message -->
        <div id="form-success" class="hidden text-center justify-center p-6 space-y-4">
          <div class="text-4xl">🎉</div>
          <h3 class="text-base font-bold text-gray-800">Registration Complete!</h3>
          <p class="text-xs text-gray-500 leading-relaxed">Thank you! Your construction supplier business has been registered successfully. The catalogue details were posted directly to our Google Sheet backend.</p>
          <button onclick="resetForm()" class="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-xs px-4 py-2 transition">
            Submit Another Store
          </button>
        </div>
      </div>
    </section>

  </main>

  <!-- Script logic -->
  <script>
    // State Initialization
    let suppliersData = [
      {
        id: "1",
        businessName: "Kebede Cement Wholesalers",
        contactName: "Kebede Alene",
        phone: "0911223344",
        telegramUsername: "kebede_cement",
        location: "Merkato",
        categories: ["Cement", "Sand/Gravel"],
        products: [
          { name: "Derba OPC Cement", spec: "50kg Bag", price: "650 ETB" },
          { name: "Dangote PPC", spec: "50kg Bag", price: "610 ETB" }
        ],
        minOrder: "100 Bags",
        delivery: "Yes",
        photoUrl: ""
      },
      {
        id: "2",
        businessName: "Conbridge Rebar & Steel Traders",
        contactName: "Yohannes Hailu",
        phone: "0912334455",
        telegramUsername: "yohan_steel",
        location: "Bole",
        categories: ["Rebar/Steel"],
        products: [
          { name: "12mm Turkish Rebar", spec: "12m length", price: "4800 ETB/pcs" },
          { name: "16mm Turkish Rebar", spec: "12m length", price: "8200 ETB/pcs" }
        ],
        minOrder: "1 Ton",
        delivery: "Yes",
        photoUrl: ""
      },
      {
        id: "3",
        businessName: "Lideta Sanitary & Plumbing",
        contactName: "Abebech Kassa",
        phone: "0920445566",
        telegramUsername: "abebech_plumbing",
        location: "Lideta",
        categories: ["Sanitary", "Tiles"],
        products: [
          { name: "Porcelain floor tiles", spec: "60x60cm Spanish", price: "1850 ETB/sqm" }
        ],
        minOrder: "20 Sqm",
        delivery: "Negotiable",
        photoUrl: ""
      }
    ];

    // Web App SDK initialization
    let telegramUser = null;
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      
      // Handle automatic Telegram theme options
      const themeParams = window.Telegram.WebApp.themeParams;
      if (themeParams && themeParams.text_color) {
        document.documentElement.style.setProperty('--tg-theme-bg-color', themeParams.bg_color);
        document.documentElement.style.setProperty('--tg-theme-text-color', themeParams.text_color);
        document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', themeParams.secondary_bg_color || '#ffffff');
      }
      telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
    }

    // Tab Switching
    function switchTab(tab) {
      const tabDir = document.getElementById('tab-dir');
      const tabReg = document.getElementById('tab-reg');
      const viewDir = document.getElementById('view-directory');
      const viewReg = document.getElementById('view-register');

      if (tab === 'directory') {
        tabDir.className = "flex flex-col items-center flex-1 py-1 font-medium text-xs text-blue-600 border-b-2 border-blue-600 transition-all duration-150";
        tabReg.className = "flex flex-col items-center flex-1 py-1 font-medium text-xs text-gray-500 hover:text-gray-900 border-b-2 border-transparent transition-all duration-150";
        viewDir.classList.remove('hidden');
        viewReg.classList.add('hidden');
      } else {
        tabReg.className = "flex flex-col items-center flex-1 py-1 font-medium text-xs text-blue-600 border-b-2 border-blue-600 transition-all duration-150";
        tabDir.className = "flex flex-col items-center flex-1 py-1 font-medium text-xs text-gray-500 hover:text-gray-900 border-b-2 border-transparent transition-all duration-150";
        viewReg.classList.remove('hidden');
        viewDir.classList.add('hidden');
      }
    }

    // Google Sheets Integration
    const GOOGLE_SCRIPT_URL = "${cleanAppsScriptUrl}";

    async function fetchLatestData() {
      if (GOOGLE_SCRIPT_URL.includes("GOOGLE_SCRIPT_URL") || GOOGLE_SCRIPT_URL.includes("YOUR")) {
        const warningEl = document.getElementById('setup-warning');
        if (warningEl) warningEl.classList.remove('hidden');
        console.log("Using Mock data as Apps Script URL is empty.");
        renderSuppliers(suppliersData);
        return;
      } else {
        const warningEl = document.getElementById('setup-warning');
        if (warningEl) warningEl.classList.add('hidden');
      }

      document.getElementById('dir-results-count').innerText = "Loading from Sheets...";
      try {
        const response = await fetch(GOOGLE_SCRIPT_URL + "?action=getSuppliers");
        const data = await response.json();
        if (data && data.status === "success" && data.data) {
          suppliersData = data.data;
          renderSuppliers(suppliersData);
        } else {
          renderSuppliers(suppliersData);
        }
      } catch (err) {
        console.error("Error fetching sheets data:", err);
        renderSuppliers(suppliersData); // Fallback to local
      }
    }

    function renderSuppliers(data) {
      const listContainer = document.getElementById('dir-list');
      const countLabel = document.getElementById('dir-results-count');
      
      listContainer.innerHTML = "";
      countLabel.innerText = "Showing " + data.length + " suppliers";

      if (data.length === 0) {
        listContainer.innerHTML = \`<div class="text-center py-6 text-gray-400 text-sm">No suppliers found matching current criteria.</div>\`;
        return;
      }

      data.forEach(supplier => {
        let firstCat = (Array.isArray(supplier.categories) && supplier.categories.length > 0) ? supplier.categories[0] : 'Other';
        
        const gradients = {
          "Cement": "from-amber-500 to-amber-700",
          "Rebar/Steel": "from-blue-500 to-indigo-700",
          "Hollow Blocks": "from-stone-500 to-stone-700",
          "Sand/Gravel": "from-orange-400 to-amber-600",
          "Tiles": "from-teal-500 to-teal-700",
          "Paint": "from-purple-500 to-pink-600",
          "Timber": "from-lime-600 to-emerald-800",
          "Sanitary": "from-cyan-500 to-blue-700",
          "Electrical": "from-yellow-400 to-orange-700",
          "Glass": "from-sky-400 to-blue-600",
          "Other": "from-slate-500 to-slate-700"
        };
        const mGradient = gradients[firstCat] || "from-blue-500 to-slate-700";

        const emojis = {
          "Cement": "🧱",
          "Rebar/Steel": "⛓️",
          "Hollow Blocks": "🧱",
          "Sand/Gravel": "🏜️",
          "Tiles": "📏",
          "Paint": "🎨",
          "Timber": "🪵",
          "Sanitary": "🚽",
          "Electrical": "⚡",
          "Glass": "🪟",
          "Other": "📦"
        };
        const mEmoji = emojis[firstCat] || "📦";

        let productsHTML = "";
        if (supplier.products && supplier.products.length > 0) {
          supplier.products.forEach(p => {
            if (p.name) {
              productsHTML += \`
                <div class="flex justify-between items-center text-[10px] leading-tight mb-1">
                  <span class="font-semibold text-gray-700 truncate pr-2">⚜️ \${p.name} \${p.spec ? '(' + p.spec + ')' : ''}</span>
                  <span class="font-black text-blue-600 tracking-tight shrink-0">\${p.price}</span>
                </div>
              \`;
            }
          });
        }

        let contactLink = supplier.telegramUsername 
          ? \`https://t.me/\${supplier.telegramUsername.replace('@','')}\` 
          : \`tel:\${supplier.phone}\`;
        
        let telegramBtn = supplier.telegramUsername 
          ? \`<a href="\${contactLink}" target="_blank" class="bg-[#2481cc] hover:bg-blue-600 active:scale-95 text-white text-[10px] font-black px-3.5 py-2 rounded-xl text-center shrink-0 transition-all duration-150 flex items-center gap-1 shadow-sm">💬 Chat Telegram</a>\` 
          : "";
        
        let phoneBtn = \`<a href="tel:\${supplier.phone}" class="text-[10px] font-black px-3 py-2 rounded-xl text-center shrink-0 transition-all duration-150 flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700">📞 Call</a>\`;

        let card = document.createElement('div');
        card.className = "bg-[var(--tg-theme-secondary-bg-color,#ffffff)] rounded-[24px] p-4 border border-gray-200/50 shadow-xs hover:border-blue-500/55 transition-all duration-200 mb-3 text-left";
        card.innerHTML = \`
          <!-- Material Asset Row Header -->
          <div class="flex items-center gap-3">
            <!-- Rich Gradient Avatar -->
            <div class="w-10 h-10 rounded-full bg-gradient-to-tr \${mGradient} flex items-center justify-center font-bold text-white shrink-0 shadow-sm shadow-black/10">
              <span class="text-xl">\${mEmoji}</span>
            </div>

            <!-- Business Main Info -->
            <div class="flex-1 min-w-0">
              <h4 class="text-xs font-extrabold truncate flex items-center gap-1 text-[var(--tg-theme-text-color,#1e293b)]">
                <span>\${supplier.businessName}</span>
                <span class="text-blue-500 text-[10px] shrink-0">✓</span>
              </h4>
              <div class="flex items-center gap-1 mt-0.5">
                <span class="text-[9px] font-bold text-gray-500">👤 \${supplier.contactName}</span>
                <span class="text-gray-400 text-[8px]">•</span>
                <span class="text-[9px] font-bold text-gray-500">📞 \${supplier.phone}</span>
              </div>
            </div>

            <!-- Balanced side info -->
            <div class="text-right shrink-0">
              <div class="text-[10px] font-black text-blue-500 uppercase tracking-tight">📍 \${supplier.location}</div>
              <div class="text-[8px] text-gray-400 font-bold mt-0.5 uppercase tracking-wide">Active Hub</div>
            </div>
          </div>

          <!-- Beautifully Organized Quotation table - Looks like an invoice -->
          \${productsHTML ? \`
          <div class="mt-3.5 rounded-2xl bg-gray-50/70 p-2.5 space-y-1.5 text-left">
            <div class="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-400/10 pb-1">
              <span>Featured Catalog Items</span>
              <span>Rate (ETB)</span>
            </div>
            \${productsHTML}
          </div>
          \` : ''}

          <!-- Order & Communication controls -->
          <div class="flex justify-between items-center mt-3 pt-3 border-t border-dashed border-gray-200/50">
            <div class="space-y-0.5 text-left">
              <div class="text-[9px] text-gray-400 font-bold">📦 Minimum: <span class="font-extrabold text-gray-700">\${supplier.minOrder}</span></div>
              <div class="text-[9px] text-gray-400 font-bold">🚛 Shipping: <span class="font-extrabold text-gray-700">\${supplier.delivery}</span></div>
            </div>

            <div class="flex gap-1.5 font-bold">
              \${telegramBtn}
              \${phoneBtn}
            </div>
          </div>
        \`;
        listContainer.appendChild(card);
      });
    }

    function filterSuppliers() {
      const query = document.getElementById('dir-search').value.toLowerCase();
      const catCheck = document.getElementById('dir-category-filter').value;

      const filtered = suppliersData.filter(sup => {
        const matchesQuery = sup.businessName.toLowerCase().includes(query) || 
                             sup.location.toLowerCase().includes(query) ||
                             sup.categories.some(c => c.toLowerCase().includes(query)) ||
                             sup.products.some(p => p.name.toLowerCase().includes(query));
        
        const matchesCat = !catCheck || sup.categories.includes(catCheck);
        return matchesQuery && matchesCat;
      });

      renderSuppliers(filtered);
    }

    function selectCategoryChip(val, btn) {
      document.getElementById('dir-category-filter').value = val;
      
      // Reset all chips to standard gray style
      document.querySelectorAll('.category-chip').forEach(el => {
        el.className = "category-chip shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer snap-start bg-gray-100 text-gray-600 hover:bg-gray-200";
      });
      
      // Make selected chip prominent blue
      btn.className = "category-chip shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer snap-start bg-blue-600 text-white shadow-sm font-semibold";
      
      filterSuppliers();
    }

    async function handleFormSubmit(event) {
      event.preventDefault();
      
      const submitBtn = document.getElementById('submit-btn');
      submitBtn.innerText = "Saving Supplier Card...";
      submitBtn.disabled = true;

      // Extract form variables
      const businessName = document.getElementById('reg-biz-name').value;
      const contactName = document.getElementById('reg-contact-name').value;
      const phone = document.getElementById('reg-phone').value;
      const telegramUsername = document.getElementById('reg-tg').value;
      const location = document.getElementById('reg-location').value;
      const minOrder = document.getElementById('reg-moq').value;
      const delivery = document.getElementById('reg-delivery').value;
      const photoUrl = document.getElementById('reg-photo-url').value;

      // Category extraction list
      const categoryCheckboxes = document.querySelectorAll('input[name="category"]:checked');
      const categories = [];
      categoryCheckboxes.forEach(cb => categories.push(cb.value));

      if (categories.length === 0) {
        alert("Please pick at least one product category!");
        submitBtn.innerText = "Register Business & Create Card";
        submitBtn.disabled = false;
        return;
      }

      // Top products array
      const products = [];
      if (document.getElementById('prod1-name').value) {
        products.push({
          name: document.getElementById('prod1-name').value,
          spec: document.getElementById('prod1-spec').value,
          price: document.getElementById('prod1-price').value
        });
      }
      if (document.getElementById('prod2-name').value) {
        products.push({
          name: document.getElementById('prod2-name').value,
          spec: document.getElementById('prod2-spec').value,
          price: document.getElementById('prod2-price').value
        });
      }

      const newSupplier = {
        action: "addSupplier",
        businessName,
        contactName,
        phone,
        telegramUsername,
        location,
        categories: JSON.stringify(categories),
        products: JSON.stringify(products),
        minOrder,
        delivery,
        photoUrl,
        registeredAt: new Date().toISOString()
      };

      // If Google Script URL exists, send request
      if (!GOOGLE_SCRIPT_URL.includes("GOOGLE_SCRIPT_URL") && !GOOGLE_SCRIPT_URL.includes("YOUR")) {
        try {
          await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors", // Crucial for standalone Apps Script post submission
            headers: {
              "Content-Type": "text/plain" // Preflight-exempt simple header to bypass OPTIONS blockage
            },
            body: JSON.stringify(newSupplier)
          });
        } catch (err) {
          console.warn("Sheets network warning/mode-no-cors expected behavior:", err);
        }
      }

      // Add to local state and reset layout
      suppliersData.unshift({
        id: String(Date.now()),
        businessName,
        contactName,
        phone,
        telegramUsername,
        location,
        categories,
        products,
        minOrder,
        delivery,
        photoUrl
      });

      // Show Telegram alert if Telegram client available
      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.showAlert) {
        window.Telegram.WebApp.showAlert("Business Registered Successfully! Catalogue card created.");
      }

      document.getElementById('supplier-form').classList.add('hidden');
      document.getElementById('form-success').classList.remove('hidden');
      
      filterSuppliers();
    }

    function resetForm() {
      document.getElementById('supplier-form').reset();
      document.getElementById('supplier-form').classList.remove('hidden');
      document.getElementById('form-success').classList.add('hidden');
      const submitBtn = document.getElementById('submit-btn');
      submitBtn.innerText = "Register Business & Create Card";
      submitBtn.disabled = false;
    }

    // Initial load: fetch live database records immediately on startup
    fetchLatestData();
  </script>
</body>
</html>`;

  const appsScriptCode = `/**
 * Google Apps Script backend for the Ethiopian Construction Supplier Directory
 * 
 * 1. Open Google Sheets (sheets.new)
 * 2. Click Extensions > Apps Script
 * 3. Delete existing template and paste this complete database script
 * 4. Click Deploy > New Deployment > Select type 'Web App'
 * 5. Configure: Execute as: "Me" and Who has access: "Anyone" (crucial)
 * 6. Authenticate permissions. Copy the web app URL and paste into your mini app.
 */

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Spreadsheet not found! Make sure you opened this script from inside Google Sheets: Google Sheets > Extensions > Apps Script. Standalone scripts on script.google.com will not work!"
    })).setMimeType(ContentService.MimeType.JSON);
  }
  var sheets = ss.getSheets();
  var sheet = sheets[0];
  var data = getRowsData(sheet);
  
  // Package result
  var result = {
    status: "success",
    data: data
  };
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Spreadsheet not found! Make sure you opened this script from inside Google Sheets: Google Sheets > Extensions > Apps Script!"
    })).setMimeType(ContentService.MimeType.JSON);
  }
  var sheets = ss.getSheets();
  var sheet = sheets[0];
  
  var params = {};
  if (e && e.postData && e.postData.contents) {
    try {
      params = JSON.parse(e.postData.contents);
    } catch (parseError) {
      // If parsing raw JSON fails, use post parameter values
      params = e.parameter || {};
    }
  } else if (e && e.parameter) {
    params = e.parameter;
  }

  // Set headers if the sheet has 0 rows or is empty
  var lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    sheet.appendRow([
      "Business Name", "Contact Name", "Phone", "Telegram Username", 
      "Location Area", "Categories", "Products JSON", "MOQ", 
      "Delivery Available", "Photo URL", "Registration Date"
    ]);
  }
  
  // Format variables
  var businessName = params.businessName || "";
  var contactName = params.contactName || "";
  var phone = params.phone || "";
  var telegramUsername = params.telegramUsername || "";
  var location = params.location || "";
  var categories = params.categories || "[]";
  var products = params.products || "[]";
  var minOrder = params.minOrder || "";
  var delivery = params.delivery || "";
  var photoUrl = params.photoUrl || "";
  var registeredAt = params.registeredAt || new Date().toISOString();
  
  // Append new row to database
  sheet.appendRow([
    businessName, contactName, phone, telegramUsername, 
    location, categories, products, minOrder, 
    delivery, photoUrl, registeredAt
  ]);
  
  var result = {
    status: "success",
    message: "Supplier recorded successfully"
  };
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Utility helper to convert sheet rows into descriptive JSON arrays
 */
function getRowsData(sheet) {
  var lastRow = sheet.getLastRow();
  var lastColumn = Math.max(sheet.getLastColumn(), 11);
  if (lastRow <= 1) return []; // Empty sheet (excluding header)
  
  var headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  var rows = sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues();
  
  var list = [];
  for (var i = 0; i < rows.length; i++) {
    var rawRow = rows[i];
    var categoriesRaw = rawRow[5] || "[]";
    var productsRaw = rawRow[6] || "[]";
    
    var categoriesArr = [];
    var productsArr = [];
    
    try {
      categoriesArr = JSON.parse(categoriesRaw);
    } catch(err) {
      categoriesArr = [categoriesRaw]; // Fallback
    }
    
    try {
      productsArr = JSON.parse(productsRaw);
    } catch(err) {
      productsArr = [];
    }
    
    list.push({
      id: "row_" + (i + 2),
      businessName: rawRow[0],
      contactName: rawRow[1],
      phone: rawRow[2],
      telegramUsername: rawRow[3],
      location: rawRow[4],
      categories: categoriesArr,
      products: productsArr,
      minOrder: rawRow[7],
      delivery: rawRow[8],
      photoUrl: rawRow[9],
      registeredAt: rawRow[10]
    });
  }
  
  // Return reversed array to place latest supplier updates first
  return list.reverse();
}`;

  const botInlineCode = `/**
 * Telegraf Telegram Bot - Inline Search & Command Script (Node.js)
 * 
 * Runs on a free Render or Railway server to:
 * 1. Listen for user messages like /start, /register
 * 2. Handle inline query inputs (e.g. typing @YourBotName cement) in any chat
 * 3. Fetch data dynamically from Google sheets API to return results instantly
 */

const { Telegraf } = require('telegraf');
const axios = require('axios');
const http = require('http');

const PORT = process.env.PORT || 3000;

// Initialize Telegraf Bot Token from env (DO NOT hardcode your token to prevent security leaks in public GitHub repos!)
const rawToken = process.env.BOT_TOKEN;
const cleanToken = rawToken ? rawToken.trim() : "";

const isDummyToken = !cleanToken || 
                     cleanToken.includes("YOUR") || 
                     cleanToken === "undefined" || 
                     cleanToken === "";

let bot = null;

if (isDummyToken) {
  console.warn("⚠️ WARNING: No valid Telegram BOT_TOKEN detected in environment variables!");
  console.warn("Please add a variable named 'BOT_TOKEN' in your Render Dashboard settings containing your live Telegram API key.");
} else {
  try {
    bot = new Telegraf(cleanToken);
  } catch (err) {
    console.error("❌ Failed to instantiate Telegraf bot:", err.message);
  }
}

// Google Apps Script or other middleware database endpoint URL
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || 
                         process.env.GOOGLE_SHEET_MIDDLEWARE || 
                         process.env.GOOGLE_SHEETS_URL || 
                         "${cleanAppsScriptUrl}";

if (bot) {
  // Helper to get robust, secure, production-ready HTTPS Launch URL
  function getLaunchUrl() {
    const rawUrl = process.env.MINI_APP_URL || "${cleanGithubPagesUrl}";
    if (!rawUrl || rawUrl.includes("YOUR") || rawUrl.trim() === "") {
      return "https://${cleanBotUsername}.github.io/conbridge-material-directory/";
    }
    let cleanUrl = rawUrl.trim();
    if (cleanUrl.startsWith("http://")) {
      cleanUrl = "https://" + cleanUrl.slice(7);
    } else if (!cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl;
    }
    return cleanUrl;
  }

  // Welcome start trigger with inline main menu launcher
  bot.start(async (ctx) => {
    try {
      const launchUrl = getLaunchUrl();
      await ctx.replyWithMarkdown(\`🏗️ *Welcome to the Conbridge Construction Material Directory Bot!*

Our system serves both Builders and Materials Suppliers. 

👉 *For Suppliers / Traders:*
Click the button below or use the Bottom-Left Menu Button to register your business, publish prices and showcase products directly!

👉 *For Contractors / Buyers:*
Open the interactive interface to browse catalog items, search prices, and contact sellers.

💡 *Inline Search:* Type \\\`@\${ctx.botInfo?.username || '${cleanBotUsername}'} [material]\\\` in any chat to pull up supplier cards immediately!

Enjoy our free directory! 🇪🇹\`, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🚀 Open Materials Directory", web_app: { url: launchUrl } }
            ],
            [
              { text: "❔ View Guide Menu", callback_data: "show_help" }
            ]
          ]
        }
      });
    } catch (err) {
      console.error("❌ Telegram start command issue:", err.message);
      try {
        await ctx.replyWithMarkdown(\`🏗️ *Welcome to the Conbridge Construction Material Bot!*

👉 *Suppliers:* Send /register to write your trading card.
👉 *Buyers:* Send /directory to browse construction stores.

⚠️ *Developer WebApp URL Warning:* Telegram rejected opening the menu because your hosted link is not using secure **HTTPS**. Ensure the URL starts strictly with **https://**.\`);
      } catch (innerErr) {
        console.error("Default welcome fallback failed:", innerErr.message);
      }
    }
  });

  bot.command('register', async (ctx) => {
    try {
      const launchUrl = getLaunchUrl();
      await ctx.reply('To register, simply click on the button below or click the bottom-left Menu Button!', {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🏗️ Open Registration Portal", web_app: { url: launchUrl } }
            ]
          ]
        }
      });
    } catch (err) {
      console.error("❌ Telegram register command issue:", err.message);
      try {
        await ctx.reply('Please register your construction profile using the bottom-left WebApp Menu Button.');
      } catch (innerErr) {
        console.error("Register fallback failed:", innerErr.message);
      }
    }
  });

  bot.command('directory', async (ctx) => {
    try {
      const launchUrl = getLaunchUrl();
      await ctx.reply('Browse building materials and locate suppliers using our interactive Mini App!', {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🔍 Open Materials App", web_app: { url: launchUrl } }
            ]
          ]
        }
      });
    } catch (err) {
      console.error("❌ Telegram directory command issue:", err.message);
      try {
        await ctx.reply('Please launch the interactive Materials Directory inside the bottom left screen launcher button.');
      } catch (innerErr) {
        console.error("Directory fallback failed:", innerErr.message);
      }
    }
  });

  bot.command('help', async (ctx) => {
    try {
      await ctx.replyWithMarkdown(\`❔ *How to use the Directory System*

• Click the Bottom Left *Mini App Menu Button* or use the inline welcome button to launch the directory.
• Search for wholesalers on the *Directory* screen.
• Register your business on the *Register Partner* screen to get high-impact visibility on our channels.
• Use Inline query anytime: Type \\\`@\${ctx.botInfo?.username || '${cleanBotUsername}'} [product_keyword]\\\` to view cards on-the-fly!\`);
    } catch (err) {
      console.error("❌ Help trigger help failing:", err.message);
    }
  });

  // Handle callback triggers
  bot.on('callback_query', async (ctx) => {
    if (ctx.callbackQuery.data === 'show_help') {
      try {
        await ctx.answerCbQuery();
        await ctx.replyWithMarkdown(\`❔ *How to use the Directory System*

• Click the Bottom Left *Mini App Menu Button* or use the inline welcome button to launch the directory.
• Search for wholesalers on the *Directory* screen.
• Register your business on the *Register Partner* screen to get high-impact visibility on our channels.
• Use Inline query anytime: Type \\\`@\${ctx.botInfo?.username || '${cleanBotUsername}'} [product_keyword]\\\` to view cards on-the-fly!\`);
      } catch (err) {
        console.error("Callback handler error:", err.message);
      }
    }
  });

  // Inline queries handle
  bot.on('inline_query', async (ctx) => {
    const query = ctx.inlineQuery.query.trim().toLowerCase();
    
    try {
      // 1. Load latest supplier catalog lists from Google App Script Sheets URL
      const response = await axios.get(\`\${APPS_SCRIPT_URL}?action=getSuppliers\`);
      const suppliers = response.data.data;
      
      // 2. Filter list based on inline search term
      const filtered = suppliers.filter(sup => {
        if (!query) return true; // Show all
        return (
          sup.businessName.toLowerCase().includes(query) ||
          sup.location.toLowerCase().includes(query) ||
          sup.categories.join(' ').toLowerCase().includes(query) ||
          sup.products.some(p => p.name.toLowerCase().includes(query))
        );
      });

      // 3. Map filtered suppliers to Telegram Inline Results
      const results = filtered.slice(0, 15).map(sup => {
        let productsTxt = sup.products.map(p => \`• \${p.name} (\${p.spec}): \${p.price}\\n\`).join('');
        
        let messageContent = \`🏗️ *SUPPLIER: \${sup.businessName}*
📍 *Location:* \${sup.location}
🏷️ *Branch Category:* \${sup.categories.join(', ')}

🛍️ *Featured Catalog:*
\${productsTxt || 'No catalog prices published'}
📦 *MOQ:* \${sup.minOrder}
🚛 *Delivery available:* \${sup.delivery}

👤 *Seller:* \${sup.contactName}
📞 *Phone:* \${sup.phone}
\${sup.telegramUsername ? \`📱 *Telegram:* @\${sup.telegramUsername.replace('@','')}\` : ''}\`;

        return {
          type: 'article',
          id: sup.id,
          title: sup.businessName,
          description: \`📍 Location: \${sup.location} | Categories: \${sup.categories.join(', ')}\`,
          input_message_content: {
            message_text: messageContent,
            parse_mode: 'Markdown'
          },
          reply_markup: {
            inline_keyboard: [
              [
                { text: '💬 Chat on Telegram', url: sup.telegramUsername ? \`https://t.me/\${sup.telegramUsername.replace('@','')}\` : \`https://t.me/${cleanBotUsername}\` }
              ]
            ]
          }
        };
      });

      return await ctx.answerInlineQuery(results, { cache_time: 10 });
      
    } catch (err) {
      console.error("Inline query processing crash:", err.message);
      
      // Fallback: Send static response if sheet connectivity is pending
      return await ctx.answerInlineQuery([
        {
          type: 'article',
          id: 'fallback_1',
          title: 'Pending Google Sheets Setup',
          description: 'Set your APPS_SCRIPT_URL in your server to enable inline queries',
          input_message_content: {
            message_text: '⚠️ Hello! The bot is currently waiting for step 6 (Google Sheets backend connectivity setup) to retrieve live directory records.'
          }
        }
      ]);
    }
  });

  const EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL || process.env.PUBLIC_URL;

  if (EXTERNAL_URL) {
    // Webhook Mode (For zero-downtime, conflict-free hosting on Render)
    const webhookPath = \`/webhook-\${cleanToken.slice(-10)}\`;
    const fullWebhookUrl = \`\${EXTERNAL_URL}\${webhookPath}\`;
    
    const webhookHandler = bot.webhookCallback(webhookPath);
    
    const server = http.createServer((req, res) => {
      if (req.url === webhookPath && req.method === 'POST') {
        webhookHandler(req, res);
      } else if (req.url === '/' || req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Conbridge Construction Material Telegram Bot is running via Webhook! - Healthy\\n');
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found\\n');
      }
    });
    
    server.listen(PORT, '0.0.0.0', async () => {
      console.log(\`📡 Web health-check server and webhook bound to port \${PORT}\`);
      try {
        console.log(\`⚙️ Requesting Telegram register webhook URL: \${fullWebhookUrl}\`);
        await bot.telegram.setWebhook(fullWebhookUrl);
        console.log("✅ Webhook successfully configured in Telegram!");
      } catch (err) {
        console.error("❌ Failed to register webhook in Telegram:", err.message);
      }
    });

    process.once('SIGINT', () => { server.close(); });
    process.once('SIGTERM', () => { server.close(); });
  } else {
    // Long Polling Mode Fallback (For simple local development or other nodes)
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Conbridge Construction Material Telegram Bot is running via Polling! - Healthy\\n');
    });

    server.listen(PORT, '0.0.0.0', () => {
      console.log('📡 Web health-check server (Polling mode) listening on port ' + PORT);
    });

    bot.launch()
      .then(() => {
        console.log("🚀 Telegram Bot is successfully listening/polling!");
      })
      .catch((err) => {
        console.error("❌ ERROR: Telegram Bot failed to launch polling:", err.message);
        console.warn("⚠️ Rendering is kept alive to prevent container collapse. Please check your BOT_TOKEN environment variable!");
      });

    process.once('SIGINT', () => {
      bot.stop('SIGINT');
      server.close();
    });
    process.once('SIGTERM', () => {
      bot.stop('SIGTERM');
      server.close();
    });
  }
} else {
  // Web Fallback if Bot is not instantiated due to dummy token
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('🛰️ System is running in web-only fallback mode. Define BOT_TOKEN to activate Telegram bot hooks.\\n');
  });
  server.listen(PORT, '0.0.0.0', () => {
    console.log("🛰️ System is running in web-only fallback mode on port " + PORT);
  });
}`;

  const packageJsonCode = `{
  "name": "conbridge-construction-material-bot",
  "version": "1.0.0",
  "description": "Ethiopian Construction Directory Chatbot Backend",
  "main": "bot.js",
  "scripts": {
    "start": "node bot.js"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "telegraf": "^4.15.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownload = (filename: string, text: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const oneClickSetupScript = 
    "mkdir -p conbridge-telegram-mini-app && cd conbridge-telegram-mini-app\n\n" +
    "cat << 'EOF' > package.json\n" + packageJsonReactCode + "\nEOF\n\n" +
    "cat << 'EOF' > vite.config.ts\n" + viteConfigReactCode + "\nEOF\n\n" +
    "cat << 'EOF' > tailwind.config.js\n" + tailwindConfigReactCode + "\nEOF\n\n" +
    "cat << 'EOF' > postcss.config.js\n" + postcssConfigReactCode + "\nEOF\n\n" +
    "cat << 'EOF' > index.html\n" + indexHtmlReactCode + "\nEOF\n\n" +
    "mkdir -p src\n\n" +
    "cat << 'EOF' > src/main.tsx\n" + mainTsxReactCode + "\nEOF\n\n" +
    "cat << 'EOF' > src/index.css\n" + indexCssReactCode + "\nEOF\n\n" +
    "cat << 'EOF' > src/App.tsx\n" + appTsxReactCode + "\nEOF\n\n" +
    "echo '📥 Installing dependencies (React, Framer Motion, Tailwind CSS, Lucide icons)...'\n" +
    "npm install\n\n" +
    "echo '✅ Conbridge workspace template unpacked successfully!'\n" +
    "echo '🏃 Running local development server...'\n" +
    "npm run dev\n";

  const oneClickSetupScriptPowerShell = 
    "# Override execution policy for current terminal process to allow scripts\n" +
    "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force\n\n" +
    "$dirName = \"conbridge-telegram-mini-app\"\n" +
    "if ((Split-Path -Leaf $pwd) -ne $dirName) {\n" +
    "    New-Item -ItemType Directory -Force -Path $dirName | Out-Null\n" +
    "    Set-Location $dirName\n" +
    "}\n\n" +
    "# Create a UTF-8 writer without BOM (Byte Order Mark) to ensure tools like Vite/PostCSS/Node can parse JSON and configs cleanly without syntax errors\n" +
    "$utf8NoBom = New-Object System.Text.UTF8Encoding($false)\n" +
    "function Write-FileNoBom($fileName, $content) {\n" +
    "    $fullPath = Join-Path $pwd $fileName\n" +
    "    $parent = Split-Path $fullPath\n" +
    "    if (!(Test-Path $parent)) {\n" +
    "        New-Item -ItemType Directory -Force -Path $parent | Out-Null\n" +
    "    }\n" +
    "    [System.IO.File]::WriteAllText($fullPath, $content, $utf8NoBom)\n" +
    "}\n\n" +
    "Write-FileNoBom \"package.json\" @'\n" + packageJsonReactCode + "\n'@\n\n" +
    "Write-FileNoBom \"vite.config.ts\" @'\n" + viteConfigReactCode + "\n'@\n\n" +
    "Write-FileNoBom \"tailwind.config.js\" @'\n" + tailwindConfigReactCode + "\n'@\n\n" +
    "Write-FileNoBom \"postcss.config.js\" @'\n" + postcssConfigReactCode + "\n'@\n\n" +
    "Write-FileNoBom \"index.html\" @'\n" + indexHtmlReactCode + "\n'@\n\n" +
    "Write-FileNoBom \"src/main.tsx\" @'\n" + mainTsxReactCode + "\n'@\n\n" +
    "Write-FileNoBom \"src/index.css\" @'\n" + indexCssReactCode + "\n'@\n\n" +
    "Write-FileNoBom \"src/App.tsx\" @'\n" + appTsxReactCode + "\n'@\n\n" +
    "Write-Host \"📥 Installing dependencies (React, Framer Motion, Tailwind CSS, Lucide icons)...\"\n" +
    "if (Get-Command npm.cmd -ErrorAction SilentlyContinue) {\n" +
    "    & npm.cmd install\n" +
    "} else {\n" +
    "    & npm install\n" +
    "}\n\n" +
    "Write-Host \"✅ Conbridge workspace template unpacked successfully!\"\n" +
    "Write-Host \"🏃 Running local development server...\"\n" +
    "if (Get-Command npm.cmd -ErrorAction SilentlyContinue) {\n" +
    "    & npm.cmd run dev\n" +
    "} else {\n" +
    "    & npm run dev\n" +
    "}\n";

  return (
    <div
      id="code_exporter_section"
      className={`space-y-6 ${isDark ? "dark-exporter text-slate-200" : "text-slate-800"}`}
    >
      <style>{`
        .dark-exporter .bg-white {
          background-color: #17212b !important;
          border-color: #24303f !important;
        }
        .dark-exporter .bg-gray-50\\/50 {
          background-color: #111921 !important;
          border-color: #24303f !important;
        }
        .dark-exporter .bg-gray-50 {
          background-color: #111921 !important;
          color: #94a3b8 !important;
        }
        .dark-exporter .border, 
        .dark-exporter .divide-y > * {
          border-color: #24303f !important;
        }
        .dark-exporter .text-gray-800 {
          color: #ffffff !important;
        }
        .dark-exporter .text-gray-600 {
          color: #c5d1e0 !important;
        }
        .dark-exporter .text-gray-500 {
          color: #94a3b8 !important;
        }
        .dark-exporter .bg-blue-50 {
          background-color: #111e2f !important;
          border-color: #2563eb40 !important;
          color: #38bdf8 !important;
        }
        .dark-exporter .text-blue-905 {
          color: #e2e8f0 !important;
        }
        .dark-exporter .bg-green-100 {
          background-color: #064e3b !important;
          color: #34d399 !important;
        }
        .dark-exporter .bg-yellow-101, .dark-exporter .bg-yellow-100 {
          background-color: #78350f !important;
          color: #f59e0b !important;
        }
        .dark-exporter .bg-purple-100 {
          background-color: #581c87 !important;
          color: #c084fc !important;
        }
        .dark-exporter .bg-indigo-101, .dark-exporter .bg-indigo-100 {
          background-color: #312e81 !important;
          color: #818cf8 !important;
        }
        .dark-exporter button.text-gray-600,
        .dark-exporter button.bg-white {
          background-color: #111921 !important;
          color: #ffffff !important;
          border-color: #24303f !important;
        }
        .dark-exporter button.text-gray-600:hover,
        .dark-exporter button.bg-white:hover {
          background-color: #202b36 !important;
        }
      `}</style>
      <div className={`p-4 rounded-xl flex gap-3 border transition-colors duration-300 ${
        isDark ? "bg-[#111e2f] border-blue-900/40 text-slate-150" : "bg-blue-50 border-blue-100 text-blue-900"
      }`}>
        <Sparkles className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-left">
          <strong className="font-semibold block mb-0.5">Configuration Sync</strong>
          The code blocks below dynamically update using parameters you input in Step 1 and Step 3! Paste them directly into your development platforms for a zero-configuration launch.
        </div>
      </div>

      {/* MINI APP CODE EXPORTER */}
      <div className="bg-white border rounded-xl divide-y">
        {/* Header with Switcher */}
        <div className="p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-gray-50/50">
          <div className="space-y-1 text-left">
            <span className="text-sm font-bold text-gray-800 block">1. Mini App Client Source Code Bundle</span>
            <div className="flex gap-2">
              <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Step 2 & 4</span>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Dual Bundle</span>
            </div>
          </div>
          
          {/* Format selection toggles */}
          <div className="flex bg-gray-105 p-1 rounded-lg">
            <button
              onClick={() => setExportFormat("html")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition focus:outline-none cursor-pointer ${
                exportFormat === "html" ? "bg-white text-blue-600 shadow-sm animate-fade-in" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Single-File HTML
            </button>
            <button
              onClick={() => setExportFormat("react")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition focus:outline-none cursor-pointer ${
                exportFormat === "react" ? "bg-white text-blue-600 shadow-sm animate-fade-in" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              React + Vite (Framer Motion)
            </button>
          </div>
        </div>

        {/* Content depending on selected format */}
        {exportFormat === "html" ? (
          <>
            <div className="p-4 flex justify-between items-center bg-gray-50/20">
              <span className="text-xs text-gray-400 font-mono">index.html</span>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(miniAppHtml, "html")}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-gray-55 text-gray-650 border rounded-lg text-xs font-semibold cursor-pointer transition focus:outline-none"
                >
                  {copiedIndex === "html" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDownload("index.html", miniAppHtml)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition focus:outline-none"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <div className="p-4 bg-gray-900 text-gray-100 text-xs font-mono overflow-x-auto max-h-72">
              <pre>{miniAppHtml}</pre>
            </div>
            <div className="p-3 text-xs text-gray-500 bg-gray-55 text-left">
              💡 <strong>Deployment Tip:</strong> Save this code as <code>index.html</code> inside an empty folder, push it to GitHub, and enable GitHub Pages under repository Settings to get a secure HTTPS web app URL!
            </div>
          </>
        ) : (
          <>
            {/* React project tabs selector */}
            <div className="p-2 bg-gray-55/50 flex gap-1.5 overflow-x-auto border-b">
              {(["setup.sh", "setup.ps1", "App.tsx", "package.json", "vite.config.ts", "index.html", "index.css", "main.tsx"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setReactActiveTab(tab)}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition shrink-0 focus:outline-none cursor-pointer ${
                    reactActiveTab === tab
                      ? "bg-blue-600 text-white shadow-xs"
                      : tab === "setup.sh" || tab === "setup.ps1"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100/70"
                        : "bg-white text-gray-550 border border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  {tab === "setup.sh" ? "⚡ setup.sh (macOS/Linux)" : tab === "setup.ps1" ? "⚡ setup.ps1 (Windows)" : `📁 ${tab}`}
                </button>
              ))}
            </div>

            {/* Actions for active tab */}
            <div className="p-4 flex justify-between items-center bg-gray-50/20">
              <span className="text-xs text-gray-400 font-mono text-left">
                {reactActiveTab === "setup.sh" ? "automated-installer / setup.sh" :
                 reactActiveTab === "setup.ps1" ? "automated-installer / setup.ps1" :
                 `src/${reactActiveTab}`}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const code = 
                      reactActiveTab === "setup.sh" ? oneClickSetupScript :
                      reactActiveTab === "setup.ps1" ? oneClickSetupScriptPowerShell :
                      reactActiveTab === "App.tsx" ? appTsxReactCode :
                      reactActiveTab === "package.json" ? packageJsonReactCode :
                      reactActiveTab === "vite.config.ts" ? viteConfigReactCode :
                      reactActiveTab === "index.html" ? indexHtmlReactCode :
                      reactActiveTab === "index.css" ? indexCssReactCode :
                      mainTsxReactCode;
                    copyToClipboard(code, "react_file");
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-gray-50 text-gray-650 border rounded-lg text-xs font-semibold cursor-pointer transition focus:outline-none"
                >
                  {copiedIndex === "react_file" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{reactActiveTab === "setup.sh" || reactActiveTab === "setup.ps1" ? "Copy Setup Script" : "Copy File"}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    const code = 
                      reactActiveTab === "setup.sh" ? oneClickSetupScript :
                      reactActiveTab === "setup.ps1" ? oneClickSetupScriptPowerShell :
                      reactActiveTab === "App.tsx" ? appTsxReactCode :
                      reactActiveTab === "package.json" ? packageJsonReactCode :
                      reactActiveTab === "vite.config.ts" ? viteConfigReactCode :
                      reactActiveTab === "index.html" ? indexHtmlReactCode :
                      reactActiveTab === "index.css" ? indexCssReactCode :
                      mainTsxReactCode;
                    handleDownload(reactActiveTab, code);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition focus:outline-none"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download file</span>
                </button>
              </div>
            </div>

            {/* Big Code area with template brackets fixed */}
            <div className="p-4 bg-gray-900 text-gray-100 text-left text-xs font-mono overflow-x-auto max-h-[480px]">
              <pre className="whitespace-pre">
                {reactActiveTab === "setup.sh" ? oneClickSetupScript :
                 reactActiveTab === "setup.ps1" ? oneClickSetupScriptPowerShell :
                 reactActiveTab === "App.tsx" ? appTsxReactCode :
                 reactActiveTab === "package.json" ? packageJsonReactCode :
                 reactActiveTab === "vite.config.ts" ? viteConfigReactCode :
                 reactActiveTab === "index.html" ? indexHtmlReactCode :
                 reactActiveTab === "index.css" ? indexCssReactCode :
                 mainTsxReactCode}
              </pre>
            </div>

            {/* Instruction Footer */}
            <div className="p-3.5 text-xs text-gray-500 bg-gray-55 leading-relaxed font-sans text-left space-y-1">
              {reactActiveTab === "setup.sh" ? (
                <div className="space-y-1 bg-emerald-50/55 p-3.5 rounded-lg border border-emerald-100">
                  <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-500 animate-bounce" />
                    ⚡ macOS / Linux / Git Bash One-Click Setup:
                  </div>
                  <ol className="list-decimal pl-4 text-emerald-950 space-y-1">
                    <li>Open your terminal window on macOS/Linux or Git Bash on Windows.</li>
                    <li>Copy the setup block above using the <strong className="text-emerald-900">Copy Setup Script</strong> button.</li>
                    <li>Paste the copied script block into your terminal and press <strong className="text-emerald-950">Enter</strong>.</li>
                    <li className="font-semibold text-emerald-900">This automatically extracts all 6 configured files, installs prerequisites in seconds, and spins up your local web preview. Keep the terminal window open to keep the dev server alive!</li>
                  </ol>
                </div>
              ) : reactActiveTab === "setup.ps1" ? (
                <div className="space-y-1 bg-teal-50/55 p-3.5 rounded-lg border border-teal-100">
                  <div className="font-bold text-teal-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-500 animate-bounce" />
                    ⚡ Windows PowerShell One-Click Setup (Highly Recommended):
                  </div>
                  <ol className="list-decimal pl-4 text-teal-950 space-y-1">
                    <li>Open <strong>PowerShell</strong> on your Windows machine (press Windows Key, search for PowerShell, and open it).</li>
                    <li>Copy this setup block using the <strong className="text-teal-900">Copy Setup Script</strong> button.</li>
                    <li>Paste the script directly inside the powershell console window and press <strong>Enter</strong>.</li>
                    <li className="font-semibold text-teal-900">This will create the directory, generate the 6 React assets dynamically, install dependencies, and launch Vite on your Windows browser instantly. Leave the PowerShell open to continue developing!</li>
                  </ol>
                </div>
              ) : (
                <>
                  <div className="font-semibold text-gray-700">⚙️ Vite + Framer Motion Quickstart Setup:</div>
                  <ol className="list-decimal pl-4 space-y-0.5">
                    <li>Create an empty folder on your desktop, and open it in a terminal.</li>
                    <li>Run <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-800">npm create vite@latest . -- --template react-ts</code></li>
                    <li>Install Framer Motion & Lucide icons: <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-800">npm install framer-motion lucide-react</code></li>
                    <li>Replace the code inside the corresponding files using the tabs above!</li>
                    <li>Run <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-800">npm run build</code> and host the compiled <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-850">dist/</code> folder anywhere with HTTPS.</li>
                  </ol>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* APPS SCRIPT DATABASE MIDDLEWARE */}
      <div class="bg-white border rounded-xl divide-y">
        <div class="p-4 flex justify-between items-center bg-gray-50/50">
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-gray-800">2. Google Apps Script Bridge (database.gs)</span>
            <span class="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Step 3</span>
          </div>
          <button
            onClick={() => copyToClipboard(appsScriptCode, "gs")}
            class="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-gray-50 text-gray-600 border rounded-lg text-xs font-semibold cursor-pointer transition"
          >
            {copiedIndex === "gs" ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600" />
                <span class="text-green-600">Copied Code</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Script</span>
              </>
            )}
          </button>
        </div>
        <div class="p-4 bg-gray-900 text-gray-100 text-xs font-mono overflow-x-auto max-h-72">
          <pre>{appsScriptCode}</pre>
        </div>
        <div class="p-3 text-xs text-gray-500 bg-gray-50">
          📈 <strong>Instructions:</strong> Paste this into the Google Sheets Apps Script compiler. Make sure to choose "Anyone" for access permissions during deployment to bypass CORS.
        </div>
      </div>

      {/* TELEGRAM INLINE ENGINE */}
      <div class="bg-white border rounded-xl divide-y">
        <div class="p-4 flex justify-between items-center bg-gray-50/50">
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-gray-800">3. Inline Chatbot Script (bot.js)</span>
            <span class="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Step 6</span>
          </div>
          <button
            onClick={() => copyToClipboard(botInlineCode, "bot")}
            class="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-gray-50 text-gray-600 border rounded-lg text-xs font-semibold cursor-pointer transition"
          >
            {copiedIndex === "bot" ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600" />
                <span class="text-green-600">Copied Server</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Backend</span>
              </>
            )}
          </button>
        </div>
        <div class="p-4 bg-gray-900 text-gray-100 text-xs font-mono overflow-x-auto max-h-72">
          <pre>{botInlineCode}</pre>
        </div>
        <div class="p-3 text-xs text-gray-500 bg-gray-50 space-y-1.5">
          <div>🔓 <strong>Security Tip:</strong> To protect your bot from hackers and prevent GitHub safety scanners from flagging leaks, your API token is <strong>never hardcoded</strong> inside this exported script.</div>
          <div>💻 <strong>Render Setup:</strong> Simply copy-paste this file into your GitHub repo, and in your <strong>Render Dashboard Environment Settings</strong>, define:</div>
          <ul class="list-disc pl-5 font-mono text-[11px] text-gray-600 space-y-0.5">
            <li><code>BOT_TOKEN</code> = <em>Your real Telegram bot API Token (from @BotFather)</em></li>
            <li><code>APPS_SCRIPT_URL</code> = <em>Your Google Apps Script Web App URL</em></li>
          </ul>
        </div>
      </div>

      {/* PACKAGE CONFIG */}
      <div class="bg-white border rounded-xl divide-y">
        <div class="p-4 flex justify-between items-center bg-gray-50/50">
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-gray-800">4. Bot Server Setup Configuration (package.json)</span>
            <span class="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Required for Render</span>
          </div>
          <button
            onClick={() => copyToClipboard(packageJsonCode, "pkg")}
            class="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-gray-50 text-gray-600 border rounded-lg text-xs font-semibold cursor-pointer transition"
          >
            {copiedIndex === "pkg" ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600" />
                <span class="text-green-600">Copied Package</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy config</span>
              </>
            )}
          </button>
        </div>
        <div class="p-4 bg-gray-900 text-gray-100 text-xs font-mono overflow-x-auto max-h-48">
          <pre>{packageJsonCode}</pre>
        </div>
        <div class="p-3 text-xs text-gray-500 bg-gray-50">
          📦 <strong>Setup:</strong> Save this exact block as <code>package.json</code> in the same folder as your <code>bot.js</code>. Render will automatically detect this configuration, download the dependencies, and launch your bot server!
        </div>
      </div>
    </div>
  );
}
