import React from "react";
import { Supplier } from "../types";
import { motion } from "motion/react";
import AnimatedPremiumEmoji from "./AnimatedPremiumEmoji";
import { ExternalLink, Radio, MessageSquare, Volume2, Bookmark, Share2 } from "lucide-react";

interface ChannelSimulatorProps {
  suppliers: Supplier[];
  channelLink: string;
  isDark?: boolean;
}

export default function ChannelSimulator({ suppliers, channelLink, isDark = false }: ChannelSimulatorProps) {
  const cleanLink = channelLink.trim() || "@Ethiopian_Construction_Network";

  return (
    <div id="channel_simulator_pane" className={`flex flex-col border rounded-2xl overflow-hidden h-full transition-colors duration-300 ${
      isDark ? "bg-[#0e1621] border-slate-800" : "bg-[#eef2f5] border-gray-200"
    }`}>
      {/* CHANNEL TOP BANNER */}
      <div className={`px-4 py-3 text-white flex justify-between items-center select-none transition-colors duration-300 ${
        isDark ? "bg-[#17212b] border-[#24303f] border-b" : "bg-[#446c8e]"
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-inner transition-colors duration-300 ${
            isDark ? "bg-[#24303f]" : "bg-yellow-50"
          }`}>
            <AnimatedPremiumEmoji name="Register" size={22} />
          </div>
          <div>
            <h4 className="text-xs font-bold leading-tight">Ethiopian Construction Network</h4>
            <span className={`text-[9.5px] transition-colors duration-300 ${isDark ? "text-slate-400" : "text-blue-100/90"}`}>{cleanLink} • Public News Channel</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded transition-colors duration-300 ${
            isDark ? "bg-[#24303f] text-teal-400" : "bg-[#315370] text-emerald-300"
          }`}>
            18.5K Subscribers
          </span>
        </div>
      </div>

      {/* TIMELINE FEED */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 max-h-[360px] select-none scrollbar-thin transition-colors duration-300 ${
        isDark ? "bg-[#0e1621]" : "bg-[#eef2f5]"
      }`}>
        {/* PINNED POST */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className={`border rounded-xl p-3 text-xs leading-relaxed shadow-sm relative transition-colors duration-300 ${
            isDark 
              ? "bg-[#182533]/80 border-blue-900/40 text-slate-300" 
              : "bg-amber-50 border-amber-200 text-slate-800"
          }`}
        >
          <span className={`absolute right-3 top-2 text-[10px] font-bold flex items-center gap-1 ${
            isDark ? "text-blue-400" : "text-amber-500"
          }`}>
            📌 PINNED FOR BUYERS
          </span>
          <div className={`font-bold mb-1 ${isDark ? "text-blue-400" : "text-amber-900"}`}>🏗️ OFFICIAL DIRECTORY LAUNCHED</div>
          <p className={`text-[11px] leading-relaxed ${isDark ? "text-slate-300" : "text-amber-805"}`}>
            Welcome, Contractors, Site Engineers & Procurement Managers! We've deployed a free interactive Mini App system. 
            
            Tap the bot below, click on <strong>"Directory"</strong> in the bottom menu bar, and unlock lists of wholesalers (Cement, Rebar, Paint, Plumbing, Glass) instantly. High-impact sellers are updated daily!
          </p>
        </motion.div>

        {/* HIGH-CONVERSION APP PROMO CHANNEL LINKING EXAMPLE */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 25, delay: 0.1 }}
          className={`border rounded-2xl p-4 space-y-3.5 shadow-sm relative transition-all duration-300 text-left ${
            isDark 
              ? "bg-[#182533] border-blue-900/15 text-slate-300" 
              : "bg-white border-blue-100 text-slate-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[9.5px] font-black uppercase tracking-wide ${isDark ? "text-amber-400" : "text-amber-600"}`}>
              ⚡ HIGH-CONVERSION CHANNEL AD
            </span>
            <span className="text-[9.5px] text-gray-400 font-mono">t.me/ConbridgeBot/app</span>
          </div>

          <div className={`font-black text-[12px] leading-tight ${isDark ? "text-blue-400" : "text-blue-950"}`}>
            📢 DISTRIBUTORS: List Your Cement & Steel Stores Live on Conbridge!
          </div>

          <p className="text-[10.5px] leading-relaxed text-gray-400 dark:text-gray-300">
            Wholesalers in Merkato, Lideta, Saris & Bole: Publish bulk pricing and inventory caps instantly! Simply tap the official bot, configure your catalogue cards, and complete secure checkout.
          </p>

          <div className="text-[10px] bg-blue-50/20 dark:bg-[#111921]/40 p-2.5 rounded-xl border border-blue-500/5 space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">💳 Native Gateways:</span>
              <span className="font-bold">Telebirr, CBE Birr & Chapa API</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">🛡️ Listing Fee:</span>
              <span className="font-extrabold text-amber-500">250.00 ETB / 50 Stars</span>
            </div>
          </div>

          {/* SIMULATED INLINE TELEGRAM CTA BUTTONS - THE PRIMARY DIRECT LINKWAY */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[9px] font-extrabold text-center uppercase tracking-wider text-gray-405 dark:text-gray-400 mb-1">
              👇 Live Channel Inline Keyboard CTAs
            </div>
            
            <div className="grid grid-cols-1 gap-1 w-full">
              <div className="bg-[#2481cc] hover:bg-blue-600 text-white rounded-xl py-2 px-3 text-[10.5px] font-black tracking-wide text-center transition flex items-center justify-center gap-1 shadow-sm select-none">
                🚀 List My Products & Stores (WebApp)
              </div>
              <div className="grid grid-cols-2 gap-1 w-full">
                <div
                  className={`border rounded-xl py-1.5 px-2 text-[9.5px] font-bold text-center select-none ${
                    isDark ? "border-[#202b36] bg-[#202b36] text-slate-350" : "border-gray-150 bg-gray-50 text-gray-600"
                  }`}
                >
                  💳 Automated Webhooks
                </div>
                <div
                  className={`border rounded-xl py-1.5 px-2 text-[9.5px] font-bold text-center select-none ${
                    isDark ? "border-[#202b36] bg-[#202b36] text-slate-350" : "border-gray-150 bg-gray-50 text-gray-600"
                  }`}
                >
                  ⭐ CBE Birr Help
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ITERATED SUPPLIER PUBLICATIONS */}
        {suppliers.map((sup, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 25, delay: idx * 0.05 }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            key={sup.id} 
            className={`border rounded-xl shadow-xs overflow-hidden divide-y transition-colors duration-300 ${
              isDark 
                ? "bg-[#17212b] border-[#24303f] divide-slate-800" 
                : "bg-white border-gray-200 divide-gray-100"
            }`}
          >
            {/* Header publisher */}
            <div className={`p-3 flex justify-between items-center transition-colors duration-300 ${
              isDark ? "bg-[#202b36]" : "bg-gray-50/50"
            }`}>
              <span className={`text-[10px] font-semibold uppercase ${isDark ? "text-slate-400" : "text-gray-400"}`}>
                🏷️ Trade Publication {idx + 1}
              </span>
              <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded transition-colors duration-300 ${
                isDark ? "bg-blue-950/80 text-blue-400" : "bg-blue-50 text-blue-600"
              }`}>
                Verified Seller
              </span>
            </div>

            {/* Inner Content matching trade catalogue details */}
            <div className="p-3.5 space-y-3 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`text-xs font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{sup.businessName}</h3>
                  <p className={`text-[10px] ${isDark ? "text-slate-400" : "text-gray-400"}`}>Conbridge construction directory profile card</p>
                </div>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded transition-colors duration-300 ${
                  isDark ? "text-slate-350 bg-[#202b36]" : "text-gray-500 bg-gray-100"
                }`}>
                  📍 {sup.location}
                </span>
              </div>

              {/* Products list styled */}
              <div className={`p-2.5 rounded-lg space-y-1 text-[11px] transition-colors duration-300 ${
                isDark ? "bg-[#111921]" : "bg-gray-50"
              }`}>
                <div className={`font-bold text-[9px] uppercase tracking-wider mb-1 ${isDark ? "text-slate-400" : "text-gray-500"}`}>Current Material Catalog:</div>
                {sup.products.slice(0, 3).map((p, pIdx) => (
                  <div key={pIdx} className="flex justify-between">
                    <span className={isDark ? "text-slate-300" : "text-gray-700"}>{p.name} {p.spec ? `(${p.spec})` : ""}</span>
                    <span className="font-bold text-blue-600 shrink-0">{p.price}</span>
                  </div>
                ))}
              </div>

              {/* Specs & constraints */}
              <div className={`grid grid-cols-2 gap-1 text-[10px] mt-1 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                <span>📦 <strong>MOQ requirement:</strong> {sup.minOrder}</span>
                <span>🚛 <strong>Delivery Option:</strong> {sup.delivery}</span>
                <span>👤 <strong>Representative:</strong> {sup.contactName}</span>
                <span>📞 <strong>Cell number:</strong> {sup.phone}</span>
              </div>

              {/* Footer Buttons */}
              <div className={`pt-3 border-t flex gap-1.5 justify-end ${isDark ? "border-slate-800" : "border-gray-105"}`}>
                <motion.a
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  href={`https://t.me/${sup.telegramUsername || "ConbridgeBot"}`}
                  target="_blank"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition"
                >
                  💬 Chat with Trader
                </motion.a>
                <span className={`text-[10.5px] font-bold px-3 py-1.5 rounded-lg transition-colors duration-300 ${
                  isDark ? "bg-[#202b36] text-slate-350" : "bg-gray-100 text-gray-700"
                }`}>
                  📞 {sup.phone}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* JOIN IN BOTTOM UTILITY FOOTER */}
      <div className={`border-t p-3 text-center flex justify-between items-center select-none transition-colors duration-300 ${
        isDark ? "bg-[#17212b] border-[#24303f]" : "bg-white border-gray-200"
      }`}>
        <div className="text-left">
          <span className={`text-[10px] block font-semibold leading-tight ${isDark ? "text-slate-500" : "text-gray-400"}`}>CHANNEL INLINE UTILITY</span>
          <span className={`text-xs font-bold ${isDark ? "text-slate-200" : "text-gray-800"}`}>Conbridge material directory</span>
        </div>
        <button className="bg-[#446c8e] hover:bg-[#32526c] text-white font-bold text-xs px-5 py-2 rounded-xl transition cursor-pointer">
          📢 View Channel Stream
        </button>
      </div>
    </div>
  );
}
