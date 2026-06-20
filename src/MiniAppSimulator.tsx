import React, { useState } from "react";
import { Supplier, Product, ThemeMode } from "../types";
import { motion, AnimatePresence } from "motion/react";
import AnimatedPremiumEmoji from "./AnimatedPremiumEmoji";
import {
  Smartphone,
  Search,
  CheckCircle2,
  RefreshCw,
  Plus,
  Trash2,
  Moon,
  Sun,
  Sparkles,
  ArrowRight,
  Send,
  Building,
  User,
  Phone,
  Tag,
  MapPin,
  ShoppingBag,
  Truck,
  CreditCard,
  AlertCircle,
  Check,
} from "lucide-react";

interface MiniAppSimulatorProps {
  suppliers: Supplier[];
  onAddSupplier: (supplier: Supplier) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  appsScriptUrl?: string;
  isFetchingSheets?: boolean;
  sheetsError?: string | null;
  onRefreshSheets?: () => void;
  sheetsSuppliersCount?: number;
}

export default function MiniAppSimulator({
  suppliers,
  onAddSupplier,
  themeMode,
  setThemeMode,
  appsScriptUrl,
  isFetchingSheets = false,
  sheetsError = null,
  onRefreshSheets,
  sheetsSuppliersCount = 0,
}: MiniAppSimulatorProps) {
  // Navigation State
  const [activeTab, setActiveTab] = useState<"directory" | "register">("directory");

  // State-driven premium in-app Toast Notification state
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  const showToast = (message: string, type: "error" | "success" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Search/Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Registration Form State
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([
    { name: "", spec: "", price: "" },
  ]);
  const [minOrder, setMinOrder] = useState("");
  const [delivery, setDelivery] = useState<"Yes" | "No" | "Negotiable">("Yes");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Automated Payment Flow Simulator States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [pendingSupplier, setPendingSupplier] = useState<Supplier | null>(null);
  const [paymentProvider, setPaymentProvider] = useState<"telebirr" | "cbe_birr" | "chapa" | "telegram_stars">("telebirr");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [paymentStep, setPaymentStep] = useState<"select" | "processing" | "success" | "failed">("select");
  const [paymentTx, setPaymentTx] = useState("");

  // Constants
  const locations = ["Merkato", "Lebu", "CMC", "Bole", "Megenagna", "Saris", "Lideta", "Other"];
  const categoriesList = [
    "Cement",
    "Rebar/Steel",
    "Hollow Blocks",
    "Sand/Gravel",
    "Tiles",
    "Paint",
    "Timber",
    "Sanitary",
    "Electrical",
    "Glass",
    "Other",
  ];

  // Handle Form changes
  const handleCategoryToggle = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleProductChange = (index: number, field: keyof Product, value: string) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const addProductRow = () => {
    if (products.length < 3) {
      setProducts([...products, { name: "", spec: "", price: "" }]);
    }
  };

  const removeProductRow = (index: number) => {
    if (products.length > 1) {
      setProducts(products.filter((_, idx) => idx !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCategories.length === 0) {
      showToast("Please select at least one material category!", "error");
      return;
    }

    // Filter blank products
    const finalProducts = products.filter((p) => p.name.trim() !== "");
    if (finalProducts.length === 0) {
      showToast("Please enter at least registration product #1!", "error");
      return;
    }

    const newSupplier: Supplier = {
      id: String(Date.now()),
      businessName,
      contactName,
      phone,
      telegramUsername: telegramUsername.replace("@", ""),
      location,
      categories: selectedCategories,
      products: finalProducts,
      minOrder,
      delivery,
      photoUrl: photoUrl || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80",
      registeredAt: new Date().toISOString(),
      paymentStatus: "unpaid",
    };

    setPendingSupplier(newSupplier);
    setPaymentPhone(phone || "0911223344");
    setPaymentStep("select");
    setIsCheckoutOpen(true);
    showToast("Opening Secure Listing Checkout...", "success");
  };

  const handlePaymentSuccess = (provider: "telebirr" | "cbe_birr" | "chapa" | "telegram_stars") => {
    if (!pendingSupplier) return;

    const txRef = `TX_${provider.toUpperCase()}_${Math.floor(100000 + Math.random() * 900000)}`;
    const amt = provider === "telegram_stars" ? "50 Stars 🌟" : "250.00 ETB";

    const updatedSupplier: Supplier = {
      ...pendingSupplier,
      paymentStatus: "paid",
      paymentProvider: provider,
      paymentAmount: amt,
      paymentTxRef: txRef,
      registeredAt: new Date().toISOString(),
    };

    // If an Apps Script Web App URL is configured, trigger a real background database record addition!
    if (appsScriptUrl && appsScriptUrl.trim() && appsScriptUrl.startsWith("http")) {
      const dbPayload = {
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
      };

      fetch(appsScriptUrl.trim(), {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain"
        },
        body: JSON.stringify(dbPayload)
      }).catch(err => {
        console.warn("Simulator backend Sheets POST network notice:", err);
      });
    }

    onAddSupplier(updatedSupplier);
    setPaymentTx(txRef);
    setPaymentStep("success");
    showToast("Payment Processed Successfully!", "success");
  };

  const resetForm = () => {
    setBusinessName("");
    setContactName("");
    setPhone("");
    setTelegramUsername("");
    setLocation("");
    setSelectedCategories([]);
    setProducts([{ name: "", spec: "", price: "" }]);
    setMinOrder("");
    setDelivery("Yes");
    setPhotoUrl("");
    setIsSuccess(false);
  };

  // Filter suppliers for material directory list
  const filteredSuppliers = suppliers.filter((sup) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      sup.businessName.toLowerCase().includes(query) ||
      sup.location.toLowerCase().includes(query) ||
      sup.contactName.toLowerCase().includes(query) ||
      sup.categories.some((c) => c.toLowerCase().includes(query)) ||
      sup.products.some((p) => p.name.toLowerCase().includes(query) || p.spec.toLowerCase().includes(query));

    const matchesCategory = selectedCategory === "" || sup.categories.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const isDark = themeMode === "telegram-dark";

  return (
    <div id="mini_app_simulator_box" class="flex flex-col items-center h-full">
      {/* MOBILE CONTAINER FRAME */}
      <div
        className={`w-full max-w-[360px] aspect-[9/19] rounded-[42px] border-[10px] border-gray-900 shadow-2xl relative flex flex-col overflow-hidden transition-all duration-300 ${
          isDark ? "bg-[#17212b] text-white" : "bg-[#f4f4f7] text-[#1f2937]"
        }`}
      >
        {/* Animated Slide-down Toast overlay */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -40, scale: 0.9 }}
              animate={{ opacity: 1, y: 45, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 450, damping: 28 }}
              className={`absolute left-4 right-4 z-50 p-3 rounded-2xl shadow-xl flex items-center gap-2.5 backdrop-blur-md border ${
                toast.type === "error"
                  ? "bg-red-505/90 bg-red-600/90 text-white border-red-500/20"
                  : "bg-emerald-600/90 text-white border-emerald-500/20"
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs shrink-0 select-none">
                {toast.type === "error" ? "✖" : "✓"}
              </div>
              <p className="text-[10.5px] font-black leading-snug tracking-wide">{toast.message}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* IPHONE CAMERA NOTCH */}
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-50 flex items-center justify-center">
          <div class="w-12 h-1 bg-gray-800 rounded-full mb-1"></div>
        </div>

        {/* SIMULATED TOP BAR */}
        <div class="pt-7 px-5 pb-2 flex justify-between items-center text-[11px] font-bold text-gray-500 z-10 select-none">
          <span>9:42 AM</span>
          <div class="flex items-center gap-1.5">
            <span class="text-emerald-500">5G</span>
            <div class="w-5 h-2.5 border border-gray-500 rounded-sm relative flex p-0.5">
              <div class="bg-gray-500 flex-1 rounded-sm"></div>
            </div>
          </div>
        </div>

        {/* TELEGRAM MINI APP TOP HEADER RENDER */}
        <div
          className={`px-4 py-3 border-b flex justify-between items-center z-10 ${
            isDark ? "bg-[#24303f] border-gray-800" : "bg-white border-gray-200"
          }`}
        >
          <div class="flex items-center gap-1.5">
            <span class="text-xs text-blue-500">✕</span>
            <div class="leading-none">
              <h4 class="text-xs font-bold line-clamp-1">Conbridge Supplier App</h4>
              <span class="text-[9px] text-gray-400">bot preview applet</span>
            </div>
          </div>
          
          <button
            onClick={() => setThemeMode(isDark ? "telegram-light" : "telegram-dark")}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              isDark ? "border-gray-800 bg-[#17212b] hover:bg-[#202b36]" : "border-gray-100 bg-gray-50 hover:bg-gray-100"
            }`}
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-yellow-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
          </button>
        </div>

        {/* MINI APP LIVE TABS SELECTOR */}
        <div
          className={`flex border-b text-[11px] font-bold relative overflow-hidden ${
            isDark ? "bg-[#182533] border-gray-800" : "bg-[#ffffff] border-[#eff2f5]"
          }`}
        >
          <button
            onClick={() => setActiveTab("directory")}
            className="flex-1 py-3 text-center cursor-pointer relative z-10 focus:outline-none"
          >
            <span className={`transition-all duration-200 ${
              activeTab === "directory"
                ? "text-blue-500 font-black scale-105 block"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-gray-500 hover:text-gray-900"
            }`}>
              🔍 Materials Directory
            </span>
            {activeTab === "directory" && (
              <motion.div
                layoutId="appletTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-500 rounded-t-full shadow-[0_-2px_10px_rgba(59,130,246,0.5)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className="flex-1 py-3 text-center cursor-pointer relative z-10 focus:outline-none"
          >
            <span className={`transition-all duration-200 ${
              activeTab === "register"
                ? "text-blue-500 font-black scale-105 block"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-gray-500 hover:text-gray-900"
            }`}>
              🏗️ Register Partner
            </span>
            {activeTab === "register" && (
              <motion.div
                layoutId="appletTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-500 rounded-t-full shadow-[0_-2px_10px_rgba(59,130,246,0.5)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        </div>

        {/* Real-time Google Sheet Syncing Badge overlay */}
        {appsScriptUrl && (
          <div className={`px-4 py-1.5 text-[9.5px] font-semibold border-b flex justify-between items-center select-none ${
            isDark ? "bg-[#1d2733] border-gray-800 text-gray-300" : "bg-blue-50/55 border-blue-100 text-blue-700"
          }`}>
            <div class="flex items-center gap-1.5">
              {isFetchingSheets ? (
                <>
                  <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />
                  <span>Syncing with live Construction DB...</span>
                </>
              ) : sheetsError ? (
                <>
                  <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0"></span>
                  <span className={isDark ? "text-red-400" : "text-red-600"}>Live Sheets DB connection failed</span>
                </>
              ) : (
                <>
                  <span class="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></span>
                  <span>Live Sheet Active: Loaded {sheetsSuppliersCount} records</span>
                </>
              )}
            </div>
            {onRefreshSheets && (
              <button 
                onClick={onRefreshSheets}
                disabled={isFetchingSheets}
                className={`p-1 rounded-md shrink-0 transition cursor-pointer hover:bg-black/10 ${
                  isFetchingSheets ? "opacity-30" : ""
                }`}
                title="Force reload database rows"
              >
                <RefreshCw className={`w-2.5 h-2.5 ${isFetchingSheets ? "animate-spin" : ""}`} />
              </button>
            )}
          </div>
        )}

        {/* INNER SCROLL CONTENT SCREEN */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4 pb-12 select-none">
          {activeTab === "directory" ? (
            <div className="space-y-4">
              {/* WALLET BALANCE HERO CARD (Telegram Wallet Style with Interactive 3D spring hover tilts) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                whileHover={{ y: -3, scale: 1.02 }}
                className={`p-4 rounded-[24px] text-center border relative overflow-hidden flex flex-col justify-between items-center transition-all duration-350 shadow-sm ${
                  isDark 
                    ? "bg-gradient-to-br from-[#1c2a38] via-[#141e2a] to-[#111922] border-gray-805/80 shadow-[0_15px_30px_rgba(0,0,0,0.4)]" 
                    : "bg-gradient-to-br from-white via-[#f7fafc] to-[#eef5fc] border-gray-200/90 shadow-[0_15px_25px_rgba(37,99,235,0.06)]"
                }`}
              >
                {/* Background ambient lighting glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-teal-500/10 rounded-full blur-xl pointer-events-none"></div>

                <div className="flex items-center gap-1.5 z-10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#2481cc] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                    Material Balance System
                  </span>
                </div>

                <div className="my-2 text-center z-10 font-sans">
                  <div className={`text-4.5xl font-extrabold tracking-tight flex items-center justify-center gap-2.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                    <div className="shrink-0">
                      <AnimatedPremiumEmoji name="Diamond" size={44} />
                    </div>
                    <span className="font-sans font-black bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">{filteredSuppliers.length}</span>
                    <span className="text-[9px] font-black bg-blue-500/10 text-blue-500 rounded-full px-2 py-0.5 uppercase tracking-wide">
                      Live
                    </span>
                  </div>
                  <div className={`text-[10px] font-bold mt-1 ${isDark ? "text-slate-400" : "text-slate-500"} uppercase tracking-wider`}>
                    Total Verified Supply Cards
                  </div>
                </div>

                {/* Micro portfolio metrics */}
                <div className="w-full grid grid-cols-2 gap-4 my-2.5 text-center text-xs border-y border-dashed border-gray-400/15 py-2 z-10">
                  <div>
                    <div className="text-[9px] text-gray-400 uppercase font-semibold">Supply Sectors</div>
                    <div className={`text-xs font-black mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>
                      🧱 {Array.from(new Set(suppliers.flatMap(s => s.categories))).length} Categories
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-gray-400 uppercase font-semibold">Districts Supported</div>
                    <div className={`text-xs font-black mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>
                      📍 {Array.from(new Set(suppliers.map(s => s.location))).length} Hubs
                    </div>
                  </div>
                </div>

                {/* Horizontal wallet actions */}
                <div className="w-full grid grid-cols-4 gap-2 mt-1 z-10">
                  <motion.button 
                    whileTap={{ scale: 0.92 }}
                    onClick={() => { setActiveTab("register"); setIsSuccess(false); }}
                    className="flex flex-col items-center gap-1 focus:outline-none cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 active:scale-95 transition-all">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className={`text-[9.5px] font-black ${isDark ? "text-slate-300" : "text-slate-600"}`}>Add Partner</span>
                  </motion.button>

                  <motion.button 
                    whileTap={{ scale: 0.92 }}
                    onClick={() => { setSearchQuery(""); setSelectedCategory(""); showToast("Search parameters reset", "success"); }}
                    className="flex flex-col items-center gap-1 focus:outline-none cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
                      <Search className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className={`text-[9.5px] font-black ${isDark ? "text-slate-300" : "text-slate-600"}`}>Reset filts</span>
                  </motion.button>

                  <motion.button 
                    whileTap={{ scale: 0.92 }}
                    onClick={onRefreshSheets}
                    disabled={isFetchingSheets}
                    className="flex flex-col items-center gap-1 focus:outline-none cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-500/10 text-teal-500 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
                      <RefreshCw className={`w-4 h-4 text-emerald-500 ${isFetchingSheets ? 'animate-spin' : ''}`} />
                    </div>
                    <span className={`text-[9.5px] font-black ${isDark ? "text-slate-300" : "text-slate-600"}`}>Sync Sheets</span>
                  </motion.button>

                  <motion.button 
                    whileTap={{ scale: 0.92 }}
                    onClick={() => {
                      showToast("Synced with Google Sheets wholesale records database!", "success");
                    }}
                    className="flex flex-col items-center gap-1 focus:outline-none cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-500/10 text-amber-500 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
                      <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                    </div>
                    <span className={`text-[9.5px] font-black ${isDark ? "text-slate-300" : "text-slate-600"}`}>Overview</span>
                  </motion.button>
                </div>
              </motion.div>

              {/* Keyword Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cement, Rebar, Saris, Bole..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-3 py-3 text-xs rounded-2xl border focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200 ${
                    isDark
                      ? "bg-[#202b36] border-transparent text-white placeholder-gray-500"
                      : "bg-white border-gray-200 text-gray-900 shadow-xs"
                  }`}
                />
              </div>

              {/* Category Filter Chips */}
              <div className="space-y-1.5 font-sans">
                <span className={`text-[10px] font-bold uppercase tracking-wider block px-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Filter by Material Asset
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x -mx-1 px-1">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("")}
                    id="chip_all"
                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200 cursor-pointer snap-start flex items-center gap-1.5 ${
                      selectedCategory === ""
                        ? "bg-blue-600 text-white shadow-sm scale-102"
                        : isDark
                        ? "bg-[#202b36] text-gray-300 hover:bg-[#2e3b4d]"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <AnimatedPremiumEmoji name="Register" size={15} />
                    <span>All</span>
                  </button>
                  {categoriesList.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        id={`chip_${cat.toLowerCase().replace(/[^a-z0-9]/g, '_')}`}
                        onClick={() => setSelectedCategory(cat)}
                        className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200 cursor-pointer snap-start flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-sm scale-102"
                            : isDark
                            ? "bg-[#202b36] text-gray-300 hover:bg-[#2e3b4d]"
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <AnimatedPremiumEmoji name={cat} size={15} />
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Results count */}
              <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold px-1">
                <span>{filteredSuppliers.length} ASSETS REGISTERED</span>
                {(searchQuery || selectedCategory) && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("");
                    }}
                    className="text-blue-500 hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {/* SUPPLIER CARD ITERATION LIST (Redesigned as Sleek Assets Portfolio Row Cards) */}
              <div className="space-y-3">
                {filteredSuppliers.length === 0 ? (
                  <div className="text-center py-8 text-xs text-gray-400 font-semibold">
                    No verified directories match the search parameters.
                  </div>
                ) : (
                  filteredSuppliers.map((sup) => {
                    // Extract initial category to show specific themed icon gradients
                    const firstCat = sup.categories[0] || "Other";
                    const gradients: Record<string, string> = {
                      "Cement": "from-amber-500 to-amber-700",
                      "Rebar/Steel": "from-blue-500 to-indigo-700",
                      "Hollow Blocks": "from-stone-500 to-stone-700",
                      "Sand/Gravel": "from-orange-400 to-amber-600",
                      "Tiles": "from-teal-500 to-teal-700",
                      "Paint": "from-purple-500 to-pink-600",
                      "Timber": "from-lime-600 to-emerald-800",
                      "Sanitary": "from-cyan-500 to-blue-700",
                      "Electrical": "from-yellow-500 to-orange-700",
                      "Glass": "from-sky-400 to-blue-600",
                      "Other": "from-slate-500 to-slate-700"
                    };
                    const mGradients = gradients[firstCat] || "from-blue-500 to-slate-700";

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.94, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ type: "spring", stiffness: 350, damping: 26 }}
                        whileHover={{ y: -3, scale: 1.015 }}
                        key={sup.id}
                        className={`rounded-[24px] p-4 border transition-all duration-300 shadow-xs hover:border-blue-500/55 hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] ${
                          isDark ? "bg-[#1d2733] border-gray-800/60" : "bg-white border-gray-100"
                        }`}
                      >
                        {/* Material Asset Row Header */}
                        <div className="flex items-center gap-3">
                          {/* Rich Gradient Avatar with Modern Animated Premium Vector Emojis */}
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${mGradients} flex items-center justify-center shrink-0 shadow-md shadow-blue-500/5`}>
                            <AnimatedPremiumEmoji name={firstCat} size={26} />
                          </div>

                          {/* Business Main Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-xs font-extrabold truncate flex flex-wrap items-center gap-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                              <span>{sup.businessName}</span>
                              {sup.paymentStatus === "paid" ? (
                                <span className="bg-amber-500/10 text-amber-500 text-[8.5px] font-black tracking-wide uppercase px-1.5 py-0.5 rounded-full flex items-center gap-0.5" title="Verified Paid Partner Product Listing">
                                  ⭐ PREMIUM
                                </span>
                              ) : (
                                <span className="text-blue-500 text-[10px] shrink-0" title="Verified Wholesaler">✓</span>
                              )}
                            </h4>
                            <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                              <span className={`text-[9px] font-bold ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                👤 {sup.contactName}
                              </span>
                              <span className="text-gray-400 text-[8px]">•</span>
                              <span className={`text-[9px] font-bold ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                📞 {sup.phone}
                              </span>
                            </div>
                          </div>

                          {/* Balanced side info */}
                          <div className="text-right shrink-0">
                            <div className="text-[10px] font-black text-blue-500 uppercase tracking-tight">
                              📍 {sup.location}
                            </div>
                            <div className="text-[8px] text-gray-400 font-bold mt-0.5 uppercase tracking-wide">
                              Active Hub
                            </div>
                          </div>
                        </div>

                        {/* Beautifully Organized Quotation table - Looks like an invoice */}
                        <div className={`mt-3.5 rounded-2xl p-2.5 space-y-1.5 ${
                          isDark ? "bg-[#161d25]" : "bg-slate-50/70"
                        }`}>
                          <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-400/10 pb-1">
                            <span>Featured Catalog Items</span>
                            <span>Rate (ETB)</span>
                          </div>
                          
                          {sup.products.map((p, pIdx) => (
                            <div key={pIdx} className="flex justify-between items-center text-[10px] leading-tight">
                              <span className={`font-semibold line-clamp-1 truncate pr-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                ⚜️ {p.name} {p.spec ? `(${p.spec})` : ""}
                              </span>
                              <span className={`font-black tracking-tight shrink-0 ${isDark ? "text-emerald-400" : "text-blue-600"}`}>
                                {p.price}
                              </span>
                            </div>
                          ))}
                        </div>

                        {sup.paymentStatus === "paid" && (
                          <div className={`mt-2.5 p-2 rounded-xl text-[8.5px] font-mono flex flex-col gap-0.5 justify-center border transition-all duration-350 ${
                            isDark 
                              ? "bg-amber-500/5 text-amber-400 border-amber-500/10 shadow-[inner_0_1px_3px_rgba(0,0,0,0.4)]" 
                              : "bg-amber-50/60 text-amber-900 border-amber-100/90"
                          }`}>
                            <div className="flex justify-between font-bold">
                              <span>💳 PAID BUSINESS LISTING</span>
                              <span>{sup.paymentAmount}</span>
                            </div>
                            <div className="flex justify-between text-[7.5px] text-gray-450 dark:text-gray-400">
                              <span>Gateway: <span className="font-extrabold uppercase">{sup.paymentProvider?.replace("_", " ")}</span></span>
                              <span className="truncate max-w-[120px]" title={sup.paymentTxRef}>Tx: {sup.paymentTxRef}</span>
                            </div>
                          </div>
                        )}

                        {/* Order & Communication controls */}
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-dashed border-gray-400/15">
                          <div className="space-y-0.5">
                            <div className="text-[9px] text-gray-400 font-bold">
                              📦 Minimum: <span className={`font-extrabold ${isDark ? "text-slate-200" : "text-slate-700"}`}>{sup.minOrder}</span>
                            </div>
                            <div className="text-[9px] text-gray-400 font-bold">
                              🚛 Shipping: <span className={`font-extrabold ${isDark ? "text-slate-200" : "text-slate-700"}`}>{sup.delivery}</span>
                            </div>
                          </div>

                          <div className="flex gap-1.5">
                            {sup.telegramUsername && (
                              <motion.a
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                href={`https://t.me/${sup.telegramUsername}`}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-[#2481cc] hover:bg-blue-600 active:scale-95 text-white text-[10px] font-black px-3.5 py-2 rounded-xl text-center shrink-0 transition-all duration-150 flex items-center gap-1 shadow-sm"
                              >
                                💬 Chat Telegram
                              </motion.a>
                            )}
                            <motion.a
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.96 }}
                              href={`tel:${sup.phone}`}
                              className={`text-[10px] font-black px-3 py-2 rounded-xl text-center shrink-0 transition-all duration-150 flex items-center gap-1 ${
                                isDark 
                                  ? "bg-[#293646] hover:bg-[#344457] text-[#55adeb]" 
                                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                              }`}
                            >
                              📞 Call
                            </motion.a>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {!isSuccess ? (
                <form onSubmit={handleSubmit} class="space-y-3.5 text-xs text-left">
                  <div class="text-center py-1">
                    <h3 className={`font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                      Supplier Application
                    </h3>
                    <p class="text-[10px] text-gray-400 mt-0.5">Enter your catalogue to join Conbridge trades</p>
                  </div>

                  {/* Business form block */}
                  <div>
                    <label class="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Tikur Abay Steel Traders"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className={`w-full py-2 px-3 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 border ${
                        isDark ? "bg-[#242f3d] border-transparent text-white" : "bg-white border-gray-200 text-gray-900"
                      }`}
                    />
                  </div>

                  {/* Contact person */}
                  <div>
                    <label class="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Yohannes Hailu"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className={`w-full py-2 px-3 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 border ${
                        isDark ? "bg-[#242f3d] border-transparent text-white" : "bg-white border-gray-200 text-gray-900"
                      }`}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label class="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Ethiopian Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g., 0911223344"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full py-2 px-3 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 border ${
                        isDark ? "bg-[#242f3d] border-transparent text-white" : "bg-white border-gray-200 text-gray-900"
                      }`}
                    />
                  </div>

                  {/* Telegram username */}
                  <div>
                    <label class="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Telegram Username (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., yohannes_trades"
                      value={telegramUsername}
                      onChange={(e) => setTelegramUsername(e.target.value)}
                      className={`w-full py-2 px-3 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 border ${
                        isDark ? "bg-[#242f3d] border-transparent text-white" : "bg-white border-gray-200 text-gray-900"
                      }`}
                    />
                  </div>

                  {/* Location selection */}
                  <div>
                    <label class="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Conbridge Trading Area *
                    </label>
                    <select
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={`w-full py-2 px-3 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 border ${
                        isDark ? "bg-[#242f3d] border-transparent text-white" : "bg-white border-gray-200 text-gray-800"
                      }`}
                    >
                      <option value="">Select branch center</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category check tags */}
                  <div>
                    <label class="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      Product Categories * (Select multiple)
                    </label>
                    <div class="grid grid-cols-2 gap-1 text-[10px]">
                      {categoriesList.slice(0, 10).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleCategoryToggle(cat)}
                          className={`py-1.5 px-2 rounded-lg border text-left flex items-center justify-between cursor-pointer ${
                            selectedCategories.includes(cat)
                              ? "bg-blue-50/80 border-blue-400 text-blue-700 font-bold"
                              : isDark
                              ? "bg-[#1d2733] border-transparent text-gray-300 hover:bg-[#232f3e]"
                              : "bg-gray-50 border-gray-100 text-gray-650 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="shrink-0"><AnimatedPremiumEmoji name={cat} size={15} /></span>
                            <span className="truncate">{cat}</span>
                          </div>
                          {selectedCategories.includes(cat) && <span className="text-blue-500 font-extrabold ml-1 shrink-0">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* PRODUCTS GRID FORM */}
                  <div>
                    <div class="flex justify-between items-center mb-1">
                      <label class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                        Featured Products (Max 3)
                      </label>
                      {products.length < 3 && (
                        <button
                          type="button"
                          onClick={addProductRow}
                          class="text-blue-500 text-[10px] font-bold flex items-center gap-0.5 hover:underline"
                        >
                          + Add product
                        </button>
                      )}
                    </div>

                    <div class="space-y-3.5">
                      {products.map((p, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl border relative ${
                            isDark ? "bg-[#1f2936] border-gray-800" : "bg-gray-50 border-gray-100"
                          }`}
                        >
                          <div class="flex justify-between items-center mb-1">
                            <span class="text-[10px] font-bold text-gray-400">Product #{idx + 1}</span>
                            {products.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeProductRow(idx)}
                                class="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <div class="space-y-2 text-xs">
                            <input
                              type="text"
                              required={idx === 0}
                              placeholder="Name (e.g. Derba OPC Cement)"
                              value={p.name}
                              onChange={(e) => handleProductChange(idx, "name", e.target.value)}
                              className={`w-full p-2 text-xs rounded-lg border focus:outline-none ${
                                isDark
                                  ? "bg-[#242f3d] border-transparent text-white"
                                  : "bg-white border-gray-200 text-gray-900"
                              }`}
                            />
                            <div class="grid grid-cols-2 gap-1.5">
                              <input
                                type="text"
                                placeholder="Spec (e.g. 50Kg Bag)"
                                value={p.spec}
                                onChange={(e) => handleProductChange(idx, "spec", e.target.value)}
                                className={`w-full p-2 text-xs rounded-lg border focus:outline-none ${
                                  isDark
                                    ? "bg-[#242f3d] border-transparent text-white"
                                    : "bg-white border-gray-200 text-gray-900"
                                }`}
                              />
                              <input
                                type="text"
                                required={idx === 0}
                                placeholder="Price (e.g. 620 ETB)"
                                value={p.price}
                                onChange={(e) => handleProductChange(idx, "price", e.target.value)}
                                className={`w-full p-2 text-xs rounded-lg border focus:outline-none ${
                                  isDark
                                    ? "bg-[#242f3d] border-transparent text-white"
                                    : "bg-white border-gray-200 text-gray-900"
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MOQ & Delivery selection */}
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label class="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        MOQ Requirements *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., 50 Bags"
                        value={minOrder}
                        onChange={(e) => setMinOrder(e.target.value)}
                        className={`w-full py-2 px-3 text-xs rounded-xl border focus:outline-none ${
                          isDark
                            ? "bg-[#242f3d] border-transparent text-white"
                            : "bg-white border-gray-200 text-gray-900"
                        }`}
                      />
                    </div>
                    <div>
                      <label class="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Delivery Available? *
                      </label>
                      <select
                        required
                        value={delivery}
                        onChange={(e) => setDelivery(e.target.value as any)}
                        className={`w-full py-2 px-3 text-xs rounded-xl border focus:outline-none ${
                          isDark ? "bg-[#242f3d] border-transparent text-white" : "bg-white border-gray-200"
                        }`}
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="Negotiable">Negotiable</option>
                      </select>
                    </div>
                  </div>

                  {/* Photo mock input link */}
                  <div>
                    <label class="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Shop Image Link (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/shop.jpg"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className={`w-full py-2 px-3 text-xs rounded-xl border focus:outline-none ${
                        isDark ? "bg-[#242f3d] border-transparent text-white" : "bg-white border-gray-200"
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    class="w-full bg-blue-500 hover:bg-blue-600 active:scale-98 text-white font-bold py-2.5 rounded-xl text-xs transition duration-150 cursor-pointer text-center"
                  >
                    Submit Catalogue Card
                  </button>
                </form>
              ) : (
                /* SUCCESS SUBMISSION MOCK DISPLAY WITH MOTION */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.85, rotate: -1 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="text-center py-6 px-1.5 space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="bg-emerald-500/10 text-emerald-500 rounded-full w-14 h-14 flex items-center justify-center mx-auto text-2.5xl shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    🚀
                  </motion.div>
                  <h3 className={`text-sm font-black truncate ${isDark ? "text-white" : "text-gray-900"}`}>Registration Complete!</h3>
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-gray-500"} leading-relaxed max-w-[280px] mx-auto`}>
                    Your digital trading card details have been dynamically catalogued. Simulated sheets are updated! Explore the "Materials Directory" to view your card.
                  </p>
                  <div className="pt-4 space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setActiveTab("directory");
                        setIsSuccess(false);
                      }}
                      className="w-full bg-blue-500 hover:bg-blue-600 font-extrabold py-2 px-3 rounded-xl text-xs text-white transition shadow-md shadow-blue-500/20 cursor-pointer block text-center"
                    >
                      View Live Directory List
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={resetForm}
                      className={`w-full font-extrabold py-2 px-3 rounded-xl text-xs transition cursor-pointer block text-center ${
                        isDark ? "bg-[#293646] hover:bg-[#344457] text-[#55adeb]" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                    >
                      Submit Another Store
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* SECURE CHECKOUT INTEGRATION MODAL OVERLAY */}
        <AnimatePresence>
          {isCheckoutOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#000000a6] backdrop-blur-xs z-50 flex flex-col justify-end"
            >
              {/* Checkout Card container */}
              <motion.div
                initial={{ y: 250 }}
                animate={{ y: 0 }}
                exit={{ y: 250 }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className={`w-full max-h-[85%] rounded-t-[32px] p-5 pb-7 flex flex-col space-y-4 select-none ${
                  isDark ? "bg-[#182533] text-white" : "bg-white text-gray-900 shadow-2xl"
                }`}
              >
                {/* Horizontal Notch Handle */}
                <div className="w-12 h-1.5 bg-gray-400/30 rounded-full mx-auto -mt-1.5 shrink-0"></div>

                {/* Checkout Header */}
                <div className="flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-500 text-xs shrink-0">🛡️</span>
                    <h3 className="text-[10px] font-extrabold tracking-wider uppercase">Secure Pay Portal</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      showToast("Payment checkout aborted", "error");
                    }}
                    className={`text-[9px] font-black px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      isDark ? "bg-red-500/15 text-red-400" : "bg-red-50 text-red-600"
                    }`}
                  >
                    Abort ✕
                  </button>
                </div>

                {/* Inner scroll container for form body */}
                <div className="flex-1 overflow-y-auto space-y-3.5 pr-0.5 text-xs text-left">
                  {paymentStep === "select" && (
                    <>
                      {/* Product Preview Info Widget */}
                      <div className={`p-3 rounded-2xl border ${
                        isDark ? "bg-[#111922] border-gray-800" : "bg-slate-50 border-gray-150"
                      }`}>
                        <div className="text-[8.5px] text-gray-400 font-bold uppercase tracking-wider mb-1">Supplier Premium License</div>
                        <h4 className="text-[11.5px] font-extrabold line-clamp-1">{pendingSupplier?.businessName}</h4>
                        <p className="text-[10px] text-gray-450 mt-1">
                          MOQ: <span className="font-bold">{pendingSupplier?.minOrder}</span> • 📍 {pendingSupplier?.location}
                        </p>
                      </div>

                      {/* Select Provider Segment */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1 block">
                          Select Automated Payment Method
                        </span>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {/* Telebirr Premium Card */}
                          <button
                            type="button"
                            onClick={() => setPaymentProvider("telebirr")}
                            className={`p-2.5 rounded-2xl border flex flex-col justify-between text-left transition cursor-pointer relative ${
                              paymentProvider === "telebirr"
                                ? "border-blue-500 bg-blue-500/5 ring-1 ring-blue-500"
                                : isDark ? "border-transparent bg-[#202b36] hover:bg-[#2e3b4d]" : "border-gray-150 bg-gray-50 hover:bg-gray-100"
                            }`}
                          >
                            <span className="text-xl">📱</span>
                            <div className="mt-2.5">
                              <div className="text-[10px] font-black">Telebirr</div>
                              <div className="text-[8.5px] text-gray-400">250.00 ETB</div>
                            </div>
                            {paymentProvider === "telebirr" && (
                              <span className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[7px] font-extrabold">✓</span>
                            )}
                          </button>

                          {/* CBE Birr Premium Card */}
                          <button
                            type="button"
                            onClick={() => setPaymentProvider("cbe_birr")}
                            className={`p-2.5 rounded-2xl border flex flex-col justify-between text-left transition cursor-pointer relative ${
                              paymentProvider === "cbe_birr"
                                ? "border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500"
                                : isDark ? "border-transparent bg-[#202b36] hover:bg-[#2e3b4d]" : "border-gray-150 bg-gray-50 hover:bg-gray-100"
                            }`}
                          >
                            <span className="text-xl">🏦</span>
                            <div className="mt-2.5">
                              <div className="text-[10px] font-black">CBE Birr</div>
                              <div className="text-[8.5px] text-gray-400">250.00 ETB</div>
                            </div>
                            {paymentProvider === "cbe_birr" && (
                              <span className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[7px] font-extrabold">✓</span>
                            )}
                          </button>

                          {/* Chapa Gateway Premium Card */}
                          <button
                            type="button"
                            onClick={() => setPaymentProvider("chapa")}
                            className={`p-2.5 rounded-2xl border flex flex-col justify-between text-left transition cursor-pointer relative ${
                              paymentProvider === "chapa"
                                ? "border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500"
                                : isDark ? "border-transparent bg-[#202b36] hover:bg-[#2e3b4d]" : "border-gray-150 bg-gray-50 hover:bg-gray-100"
                            }`}
                          >
                            <span className="text-xl">💳</span>
                            <div className="mt-2.5">
                              <div className="text-[10px] font-black">Chapa</div>
                              <div className="text-[8.5px] text-gray-400">250.00 ETB</div>
                            </div>
                            {paymentProvider === "chapa" && (
                              <span className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[7px] font-extrabold">✓</span>
                            )}
                          </button>

                          {/* Telegram Stars Premium Card */}
                          <button
                            type="button"
                            onClick={() => setPaymentProvider("telegram_stars")}
                            className={`p-2.5 rounded-2xl border flex flex-col justify-between text-left transition cursor-pointer relative ${
                              paymentProvider === "telegram_stars"
                                ? "border-amber-500 bg-amber-500/5 ring-1 ring-amber-500"
                                : isDark ? "border-transparent bg-[#202b36] hover:bg-[#2e3b4d]" : "border-gray-150 bg-gray-50 hover:bg-gray-100"
                            }`}
                          >
                            <span className="text-xl">🌟</span>
                            <div className="mt-2.5">
                              <div className="text-[11px] font-black">TG Stars</div>
                              <div className="text-[8.5px] text-gray-400">50 Stars</div>
                            </div>
                            {paymentProvider === "telegram_stars" && (
                              <span className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[7px] font-extrabold">✓</span>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Payee Info Input */}
                      <div className="space-y-1.5 text-xs">
                        <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                          {paymentProvider === "telegram_stars"
                            ? "Telegram Account Username"
                            : paymentProvider === "chapa"
                            ? "Card Holder Email Address"
                            : `${paymentProvider === "telebirr" ? "Telebirr" : "CBE Birr"} Mobile Wallet Number *`}
                        </label>
                        <input
                          type="text"
                          value={paymentPhone}
                          onChange={(e) => setPaymentPhone(e.target.value)}
                          placeholder={
                            paymentProvider === "telegram_stars"
                              ? "@username"
                              : paymentProvider === "chapa"
                              ? "supplier@conbridge.com"
                              : "e.g., 0911223344"
                          }
                          className={`w-full py-2 px-3 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 border ${
                            isDark ? "bg-[#202b36] border-transparent text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                          }`}
                        />
                        <p className="text-[8px] text-gray-400 pl-1 leading-relaxed">
                          Secure API connection active. Automated checkout validates deposits via secure webhook.
                        </p>
                      </div>

                      {/* Checkout Button */}
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => {
                          if (!paymentPhone.trim()) {
                            showToast("Please enter confirmation details", "error");
                            return;
                          }
                          setPaymentStep("processing");
                        }}
                        className={`w-full font-black py-2.5 rounded-xl text-xs text-white transition text-center shadow-lg shadow-blue-500/10 cursor-pointer block ${
                          paymentProvider === "telebirr"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : paymentProvider === "cbe_birr"
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : paymentProvider === "chapa"
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-amber-600 hover:bg-amber-700"
                        }`}
                      >
                        🔒 Pay {paymentProvider === "telegram_stars" ? "50 Stars 🌟" : "250.00 ETB"}
                      </motion.button>
                    </>
                  )}

                  {paymentStep === "processing" && (
                    <div className="py-8 text-center space-y-4 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full border-4 border-t-amber-500 border-amber-500/20 animate-spin shrink-0"></div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-extrabold uppercase tracking-wide">Waiting for Approval...</h4>
                        <p className="text-[10px] text-gray-450 dark:text-gray-400 max-w-[240px] leading-relaxed mx-auto">
                          A collection prompt request has been pushed to <span className="font-bold text-blue-500">{paymentPhone}</span>. Please authorize the transaction or choose simulation below.
                        </p>
                      </div>

                      {/* Explicit Interactive simulator controls requested by user */}
                      <div className={`w-full p-3.5 rounded-2xl border text-center space-y-2.5 mt-4 ${
                        isDark ? "bg-[#111922] border-gray-800" : "bg-slate-50 border-gray-150"
                      }`}>
                        <div className="text-[9px] text-gray-450 dark:text-gray-400 font-extrabold uppercase tracking-wider">
                          🛠️ AUTOMATED PAYMENT SIMULATOR
                        </div>
                        <div className="grid grid-cols-2 gap-2 w-full">
                          <button
                            type="button"
                            onClick={() => handlePaymentSuccess(paymentProvider)}
                            className="bg-emerald-600 hover:bg-emerald-700 font-black text-[10px] py-2 px-1.5 rounded-xl text-white transition cursor-pointer"
                          >
                            Simulate Success (Webhook ⚡)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentStep("failed");
                              showToast("Transaction declined by bank", "error");
                            }}
                            className="bg-red-600 hover:bg-red-700 font-black text-[10px] py-2 px-1.5 rounded-xl text-white transition cursor-pointer"
                          >
                            Simulate Failure (Decline ❌)
                          </button>
                        </div>
                        <p className="text-[8px] text-gray-400 leading-snug">
                          Click either button to simulate live payment gateway responses.
                        </p>
                      </div>
                    </div>
                  )}

                  {paymentStep === "success" && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="py-5 text-center space-y-3.5 flex flex-col items-center"
                    >
                      <div className="w-12 h-12 bg-emerald-500/15 text-emerald-500 rounded-full flex items-center justify-center text-xl shadow-[0_0_15px_rgba(16,185,129,0.25)] font-bold">
                        ✓
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-black uppercase text-emerald-500">Transaction Confirmed!</h4>
                        <p className="text-[9.5px] text-gray-450 dark:text-gray-450 max-w-[240px] leading-relaxed mx-auto">
                          The system matched reference <span className="font-mono font-bold text-gray-300">{paymentTx}</span>.
                        </p>
                      </div>

                      {/* Digital Receipt Spec */}
                      <div className={`w-full p-3 rounded-2xl text-[9px] font-mono text-left space-y-1 border ${
                        isDark ? "bg-[#111922] border-gray-800 text-gray-300" : "bg-slate-50 border-gray-200 text-slate-800"
                      }`}>
                        <div className="text-center font-extrabold border-b border-gray-400/15 pb-1 text-blue-500 mb-1.5 uppercase tracking-wider">
                          Official Secure Receipt
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Merchant:</span>
                          <span className="font-bold">Conbridge Trading App</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Client:</span>
                          <span className="font-extrabold truncate max-w-[150px]">{pendingSupplier?.businessName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Gateway:</span>
                          <span className="font-bold uppercase">{paymentProvider.replace("_", " ")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Ref:</span>
                          <span className="font-bold">{paymentTx}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-400/15 pt-1 mt-1 font-black">
                          <span className="text-amber-500 text-[10px]">Total Paid:</span>
                          <span className="text-amber-500 text-[10px]">{paymentProvider === "telegram_stars" ? "50 Stars 🌟" : "250.00 ETB"}</span>
                        </div>
                      </div>

                      {/* Proceed button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setIsCheckoutOpen(false);
                          setIsSuccess(true);
                        }}
                        className="w-full bg-blue-500 hover:bg-blue-600 font-extrabold py-2.5 rounded-xl text-xs text-white transition text-center shadow-lg shadow-blue-500/20 cursor-pointer block"
                      >
                        Publish Verified Live Listing 🎉
                      </motion.button>
                    </motion.div>
                  )}

                  {paymentStep === "failed" && (
                    <div className="py-6 text-center space-y-4 flex flex-col items-center">
                      <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center text-xl shrink-0 font-bold">
                        ✖
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-black uppercase text-red-500">Transaction Failed</h4>
                        <p className="text-[10px] text-gray-400 max-w-[240px] leading-relaxed mx-auto">
                          The payment collection was rejected. Complete verified transaction clearance is required to proceed with listing.
                        </p>
                      </div>

                      <div className="w-full grid grid-cols-2 gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => setPaymentStep("select")}
                          className={`font-bold py-2 rounded-xl text-[10px] cursor-pointer ${
                            isDark ? "bg-[#293646] hover:bg-[#344457] text-[#55adeb]" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          }`}
                        >
                          🔄 Retry Pay
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCheckoutOpen(false);
                          }}
                          className="bg-red-600 hover:bg-red-700 font-bold py-2 rounded-xl text-[10px] text-white transition cursor-pointer"
                        >
                          Cancel Listing ✕
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTTOM HOME INDICATOR GESTURE BAR */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-gray-500/80 rounded-full z-10 select-none"></div>
      </div>
    </div>
  );
}
