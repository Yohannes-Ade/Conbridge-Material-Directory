import React, { useState, useEffect } from "react";
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

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyCJ205BtkEc2IZ43eg3IwPGPC1DxrkDVX7C8r9o0e75wmHcKDtf7Ptz6r2kdZL_nM/exec";

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
      const res = await fetch(`${APPS_SCRIPT_URL}?action=getSuppliers`);
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
    const txRef = `TX_${provider.toUpperCase()}_${Math.floor(100000 + Math.random() * 900000)}`;
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
      window.Telegram.WebApp.showAlert(`Premium Listing Activated! Invoice No: ${txRef}`);
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
          className={`flex-1 py-3 text-xs font-semibold transition flex flex-col items-center gap-1.5 ${
            activeTab === "directory" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400 hover:text-gray-650"
          }`}
        >
          <span>🔍</span>
          <span>Directory List</span>
        </button>
        <button
          onClick={() => setActiveTab("register")}
          className={`flex-1 py-3 text-xs font-semibold transition flex flex-col items-center gap-1.5 ${
            activeTab === "register" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400 hover:text-gray-650"
          }`}
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
                  <RefreshCw className={`w-4 h-4 text-blue-600 ${loading ? "animate-spin" : ""}`} />
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
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold shrink-0 transition-colors snap-start focus:outline-none cursor-pointer ${
                      selectedCategory === ""
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    🏗️ All Materials
                  </button>
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold shrink-0 transition-colors snap-start focus:outline-none cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-550 hover:bg-gray-200"
                      }`}
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
                        href={`https://t.me/${sup.telegramUsername || "yourbotusername"}`}
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
                        className={`p-2.5 rounded-xl border text-[10px] font-semibold text-center shrink-0 transition-colors cursor-pointer focus:outline-none ${
                          selectedCategories.includes(cat)
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                        }`}
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
                          className={`p-3 rounded-2xl border flex flex-col justify-between text-left relative focus:outline-none cursor-pointer ${
                            paymentProvider === "telebirr" ? "border-blue-500 bg-blue-50/20" : "border-gray-200"
                          }`}
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
                          className={`p-3 rounded-2xl border flex flex-col justify-between text-left relative focus:outline-none cursor-pointer ${
                            paymentProvider === "cbe_birr" ? "border-indigo-500 bg-indigo-50/20" : "border-gray-200"
                          }`}
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
                          className={`p-3 rounded-2xl border flex flex-col justify-between text-left relative focus:outline-none cursor-pointer ${
                            paymentProvider === "chapa" ? "border-emerald-500 bg-emerald-50/20" : "border-gray-200"
                          }`}
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
                          className={`p-3 rounded-2xl border flex flex-col justify-between text-left relative focus:outline-none cursor-pointer ${
                            paymentProvider === "telegram_stars" ? "border-amber-500 bg-amber-50/20" : "border-gray-200"
                          }`}
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
}