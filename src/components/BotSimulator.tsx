import React, { useState } from "react";
import { Supplier, Product } from "../types";
import { motion, AnimatePresence } from "motion/react";
import AnimatedPremiumEmoji from "./AnimatedPremiumEmoji";
import { Send, Sparkles } from "lucide-react";

interface BotSimulatorProps {
  suppliers: Supplier[];
  botUsername: string;
  isDark?: boolean;
}

interface Message {
  sender: "user" | "bot";
  text: string;
  isMarkdown?: boolean;
}

export default function BotSimulator({ suppliers, botUsername, isDark = false }: BotSimulatorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: `🏗️ *Welcome to the Conbridge Construction Material Directory Bot!*

Our system serves both Builders and Materials Suppliers. 

👉 *For Suppliers / Traders:*
Click the menu button or key commands below to register your business, publish prices and showcase products directly!

👉 *For Contractors / Buyers:*
Browse and search inline inside any chat window by typing:
@${botUsername || "ConbridgeBot"} cement
@${botUsername || "ConbridgeBot"} rebar

🤖 *AI Matchmaker Active:*
You can ask our built-in AI assistant to match you with matching wholesale sellers. Type queries like "Need 250 bags cement near Merkato".

Enjoy our free directory system! 🇪🇹`,
      isMarkdown: true,
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [inlineQuery, setInlineQuery] = useState("");
  const [showInlineResults, setShowInlineResults] = useState(false);
  const [isAiActive, setIsAiActive] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const cleanUsername = botUsername.trim() || "ConbridgeBot";

  const suggestionScenarios = [
    "Need 250 bags OPC cement in Merkato",
    "Find rebar wholesalers with delivery to Bole",
    "Best sanitary & tiles supplier near Lideta"
  ];

  const handleMatchRequest = async (textToMatch: string) => {
    const userMessage: Message = { sender: "user", text: textToMatch };
    setMessages((prev) => [...prev, userMessage]);
    setIsAiLoading(true);

    try {
      const response = await fetch("/api/match-buyer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: textToMatch, suppliers }),
      });
      const data = await response.json();
      
      if (data && data.text) {
        setMessages((prev) => [
          ...prev, 
          { sender: "bot", text: data.text, isMarkdown: true }
        ]);
      } else {
        setMessages((prev) => [
          ...prev, 
          { 
            sender: "bot", 
            text: `⚠️ *System Note:* Failed to run smart matchmaking. Please check your connection or server logs.` 
          }
        ]);
      }
    } catch (err: any) {
      console.error("Matchmaking request failure:", err);
      setMessages((prev) => [
        ...prev, 
        { 
          sender: "bot", 
          text: `❌ *Network Issue:* Failed to ask GenAI. Reason: ${err.message || 'unknown'}` 
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const triggerCommand = (command: string) => {
    const userMessage: Message = { sender: "user", text: command };
    
    let botReplyText = "";
    if (command === "/start") {
      botReplyText = `🏗️ *Welcome to the Conbridge Construction Material Directory Bot!*
      
Click the menu button in the bottom left or use our commands to list your wholesale businesses.
      
Try our **🤖 AI Buyer-Matching** by typing normal questions like: 
"Find cement under 700 ETB near Merkato"

Or search inline anywhere:
@${cleanUsername} cement
@${cleanUsername} rebar`;
    } else if (command === "/register") {
      botReplyText = `📝 *SUPPLIER REGISTRATION CHECKLIST:*
      
Simply click on the bottom-left Menu Button **"Directory 🏗️"** inside this chat pane, flip to the "Register Partner" tab, and input your wholesale catalog details!
  
Your business trade card will instantly sync with our Google Sheets file in under 2 seconds.`;
    } else if (command === "/directory") {
      botReplyText = `🔍 *MATERIALS DIRECTORY SEARCH TRIGGER:*
      
Click the bottom-left WebApp button to browse. Alternatively, type your material tags inline in any search window:
\`@${cleanUsername} cement\`
\`@${cleanUsername} hollow blocks\``;
    } else if (command === "/prices") {
      botReplyText = `📈 *WEEKLY MATERIAL PRICE INDICES (ADDIS ABABA):*
      
• OPC Cement (Derba/Dangote): 640 - 665 ETB / Bag
• PPC Cement (Derba/Mugher): 595 - 620 ETB / Bag
• Rebar (Grade 60 Local): 4,800 - 5,200 ETB / Pcs
• River Sand: 1,800 ETB / Cubic Meter
• Concrete Hollow Blocks: 45 ETB / Pcs
      
*Prices fluctuate dynamically based on energy / logistics constraints. Refresh daily inside the app directory.*`;
    } else if (command === "/tenders") {
      botReplyText = `📥 *ACTIVE ADDIS ABABA CONSTRUCTION TENDERS:*
      
1. [AAWSA] Construction of Secondary Sewer Lines in Lideta Area. Bids close June 28, 2026.
2. [ERA] Federal Expressway Asphalt Paving - Modjo-Hawassa route. Bids close July 5, 2026.
      
*To pitch for tenders, register your material catalog with verified MOQ capabilities.*`;
    } else if (command === "/help") {
      botReplyText = `❔ *How to use the Construction Directory System*
 
• Type normal construction needs (e.g. "I want rebar") to invoke our **AI Matchmaker**. He cross-checks local + Google Sheet inventory!
• Click the bottom left **WebApp Button** to launch the directory.
• Search for wholesalers on the **Directory** tab.
• Register on the **Register Partner** tab to get high-impact visibility on our channels.
• Use inline query: Type \`@${cleanUsername} [product_keyword]\` to view cards on-the-fly!`;
    } else {
      botReplyText = `Sorry, I didn't recognize that command. Click the Bottom Launcher menu or use '/help' to see valid triggers!`;
    }

    setMessages((prev) => [...prev, userMessage, { sender: "bot", text: botReplyText, isMarkdown: true }]);
  };

  const handleCustomSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText("");

    if (text.startsWith("/")) {
      triggerCommand(text);
    } else if (isAiActive) {
      handleMatchRequest(text);
    } else {
      const userMessage: Message = { sender: "user", text };
      const botResponse: Message = {
        sender: "bot",
        text: `💡 Hello! To talk to our smart list engine, click the Bottom Left WebApp key, or send code commands like \`/register\` or \`/prices\`.

To search materials inline, type \`@${cleanUsername} [keyword]\` below, or toggle **🤖 AI Auto-Matchmaker** on!`,
      };
      setMessages((prev) => [...prev, userMessage, botResponse]);
    }
  };

  const inlineFiltered = suppliers.filter((sup) => {
    if (!inlineQuery) return true;
    const q = inlineQuery.toLowerCase();
    return (
      sup.businessName.toLowerCase().includes(q) ||
      sup.location.toLowerCase().includes(q) ||
      sup.categories.some((c) => c.toLowerCase().includes(q)) ||
      sup.products.some((p) => p.name.toLowerCase().includes(q))
    );
  });

  const selectInlineResult = (sup: Supplier) => {
    const productsTxt = sup.products.map((p) => `• ${p.name} (${p.spec}): ${p.price}`).join("\n");
    const formattedCard = `🏗️ *MATERIAL CATALOG CARD: ${sup.businessName}*
📍 *Location Area:* ${sup.location}
🏷️ *Branch Category:* ${sup.categories.join(", ")}
 
🛍️ *Featured Catalog:*
${productsTxt || "No specific prices listed"}
 
📦 *MOQ:* ${sup.minOrder}
🚛 *Delivery available:* ${sup.delivery}
 
👤 *Seller:* ${sup.contactName}
📞 *Phone:* ${sup.phone}
${sup.telegramUsername ? `📱 *Telegram User:* @${sup.telegramUsername}` : ""}`;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: `🔍 Queried keyboard: @${cleanUsername} ${inlineQuery}`,
      },
      {
        sender: "bot",
        text: formattedCard,
        isMarkdown: true,
      },
    ]);

    setInlineQuery("");
    setShowInlineResults(false);
  };

  return (
    <div id="bot_simulator_widget" className={`flex flex-col border rounded-2xl overflow-hidden h-full transition-colors duration-300 ${
      isDark ? "bg-[#0e1621] border-slate-800" : "bg-[#eef2f5] border-gray-200"
    }`}>
      {/* BOT PANE CHAT TOP BAR */}
      <div className={`px-4 py-3 text-white flex justify-between items-center select-none transition-colors duration-300 ${
        isDark ? "bg-[#17212b] border-[#24303f] border-b" : "bg-[#517da2]"
      }`}>
        <div className="flex items-center gap-2 font-bold text-xs font-sans">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-inner transition-colors duration-300 ${
            isDark ? "bg-[#24303f]" : "bg-blue-100"
          }`}>
            <AnimatedPremiumEmoji name="Register" size={22} />
          </div>
          <div>
            <h4 className="text-xs font-bold leading-tight">Conbridge Construction Material Bot</h4>
            <span className={`text-[9.5px] flex items-center gap-1 transition-colors duration-300 ${
              isDark ? "text-slate-400" : "text-blue-100/90"
            }`}>@ {cleanUsername} • bot</span>
          </div>
        </div>
        
        {/* DESIGN AI TOGGLE HEADER ACCENT */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsAiActive(!isAiActive)}
            className={`text-[9.5px] px-2 py-0.5 rounded-full font-extrabold flex items-center gap-1 transition cursor-pointer select-none ${
              isAiActive
                ? "bg-emerald-500 text-white animate-pulse"
                : "bg-gray-500/30 text-slate-300 hover:bg-gray-500/50"
            }`}
            title="Toggle AI Matchmaker from Sheets/Local"
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>AI Matchmaker {isAiActive ? "ON" : "OFF"}</span>
          </button>
          
          <span className={`text-[9.5px] px-2 py-0.5 rounded font-bold font-mono transition-colors duration-300 ${
            isDark ? "bg-[#24303f] text-emerald-400" : "bg-[#3a6385] text-white"
          }`}>
            Online
          </span>
        </div>
      </div>

      {/* LIVING CHAT MESSAGE TIMELINE */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-3.5 min-h-[300px] max-h-[340px] scrollbar-thin transition-colors duration-300 ${
        isDark ? "bg-[#0e1621]" : "bg-[#eef2f5]"
      }`}>
        {messages.map((m, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 480, damping: 28 }}
            key={idx} 
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[11.5px] leading-relaxed shadow-sm transition-all duration-300 ${
                m.sender === "user"
                  ? isDark ? "bg-[#2b5278] text-white shadow-[#2b5278]/10" : "bg-[#effedd] text-[#1f2937]"
                  : isDark ? "bg-[#182533] text-white border border-slate-800/60" : "bg-white text-[#1f2937]"
              }`}
            >
              {m.isMarkdown ? (
                <div className="whitespace-pre-wrap font-sans text-left space-y-1">
                  {m.text.split("\n").map((line, lIdx) => {
                    let renderLine = line;
                    const isBold = renderLine.startsWith("**") && renderLine.endsWith("**");
                    if (isBold) {
                      return <p key={lIdx} className="font-extrabold text-blue-400">{renderLine.slice(2, -2)}</p>;
                    }
                    return <p key={lIdx}>{renderLine}</p>;
                  })}
                </div>
              ) : (
                <p className="whitespace-pre-wrap font-sans text-left">{m.text}</p>
              )}
            </div>
          </motion.div>
        ))}

        {/* AI PROCESS RUNNING LOADER */}
        {isAiLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[11px] font-semibold flex items-center gap-2.5 transition-colors duration-300 animate-pulse ${
              isDark ? "bg-[#182533] text-blue-400 border border-blue-500/10" : "bg-white text-blue-700"
            }`}>
              <Sparkles className="w-3.5 h-3.5 animate-spin text-blue-500" />
              <span>Conbridge AI Matchmaker is pulling database records from Google Sheets & matching suppliers...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* FLOATING INLINE RESULTS SIMULATOR */}
      {showInlineResults && (
        <div className={`border-t border-b overflow-y-auto max-h-40 divide-y shadow-lg relative z-15 transition-colors duration-300 ${
          isDark ? "bg-[#17212b] border-[#24303f] divide-slate-800/80" : "bg-white border-gray-200 divide-gray-100"
        }`}>
          <div className={`p-2 text-[10px] font-bold flex justify-between transition-colors duration-300 ${
            isDark ? "bg-[#182533] text-blue-400" : "bg-blue-50 text-blue-800"
          }`}>
            <span>🔴 INLINE QUERY ACTIVE: Returning Suppliers ({inlineFiltered.length})</span>
            <button onClick={() => setShowInlineResults(false)} className={`${isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-black"}`}>✖</button>
          </div>
          {inlineFiltered.length === 0 ? (
            <div className={`p-3 text-xs text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}>No suppliers match inline query.</div>
          ) : (
            inlineFiltered.map((sup) => (
              <button
                key={sup.id}
                onClick={() => selectInlineResult(sup)}
                className={`w-full text-left p-2.5 flex justify-between items-center cursor-pointer transition text-xs ${
                  isDark ? "hover:bg-[#202b36] border-slate-800 text-slate-200" : "hover:bg-gray-50 text-gray-800"
                }`}
              >
                <div>
                  <span className={`font-bold text-xs block ${isDark ? "text-white" : "text-gray-800"}`}>{sup.businessName}</span>
                  <span className={`text-[10px] font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>📍 {sup.location} • Categories: {sup.categories.join(", ")}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    isDark ? "bg-blue-950 text-blue-400" : "bg-blue-100 text-blue-700"
                  }`}>Share Card</span>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* HORIZONTAL SCROLL DECORATED QUICK RECOMMENDATION PILLS */}
      {isAiActive && (
        <div className={`border-t p-2 flex flex-col gap-1 transition-colors duration-300 ${
          isDark ? "bg-[#101921] border-[#24303f]" : "bg-slate-50 border-gray-200"
        }`}>
          <div className={`text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 ml-1 select-none ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            <Sparkles className="w-3 h-3 text-yellow-500 animate-bounce" />
            <span>Quick AI Buyer Matching Scenarios (TAP TO RUN IN LIVE ECOSYSTEM):</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 pl-1 scrollbar-none scroll-smooth">
            {suggestionScenarios.map((scText, scIdx) => (
              <button
                key={scIdx}
                disabled={isAiLoading}
                onClick={() => handleMatchRequest(scText)}
                className={`text-[10.5px] font-semibold py-1 px-3.5 rounded-full border transition shrink-0 cursor-pointer text-left focus:outline-none ${
                    isDark 
                      ? "bg-[#182533] hover:bg-[#202b36] text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white" 
                      : "bg-white hover:bg-gray-100 text-slate-700 border-gray-200/90 shadow-2xs hover:shadow-xs hover:border-gray-300"
                }`}
              >
                🔎 "{scText}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* QUICK ACTIONS UTILITY BAR */}
      <div className={`border-t p-2 flex flex-wrap gap-1.5 justify-center select-none transition-colors duration-300 ${
        isDark ? "bg-[#17212b] border-[#24303f]" : "bg-white border-gray-200"
      }`}>
        <button
          onClick={() => triggerCommand("/start")}
          className={`rounded-lg text-[10px] font-bold px-2 py-1 transition cursor-pointer ${
            isDark ? "bg-[#202b36] text-slate-300 hover:bg-[#2b394a]" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          🤖 /start
        </button>
        <button
          onClick={() => triggerCommand("/register")}
          className={`rounded-lg text-[10px] font-bold px-2 py-1 transition cursor-pointer ${
            isDark ? "bg-[#202b36] text-slate-300 hover:bg-[#2b394a]" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          📝 /register
        </button>
        <button
          onClick={() => triggerCommand("/directory")}
          className={`rounded-lg text-[10px] font-bold px-2 py-1 transition cursor-pointer ${
            isDark ? "bg-[#202b36] text-slate-300 hover:bg-[#2b394a]" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          🔍 /directory
        </button>
        <button
          onClick={() => triggerCommand("/prices")}
          className={`rounded-lg text-[10px] font-bold px-2 py-1 transition cursor-pointer ${
            isDark ? "bg-[#202b36] text-slate-300 hover:bg-[#2b394a]" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          📈 /prices
        </button>
        <button
          onClick={() => triggerCommand("/tenders")}
          className={`rounded-lg text-[10px] font-bold px-2 py-1 transition cursor-pointer ${
            isDark ? "bg-[#202b36] text-slate-300 hover:bg-[#2b394a]" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          📥 /tenders
        </button>
        <button
          onClick={() => triggerCommand("/help")}
          className={`rounded-lg text-[10px] font-bold px-2 py-1 transition cursor-pointer ${
            isDark ? "bg-[#202b36] text-slate-300 hover:bg-[#2b394a]" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          ❕ /help
        </button>
      </div>

      {/* INTERACTIVE INPUT TEXT FORM */}
      <form onSubmit={handleCustomSend} className={`border-t p-2 flex gap-1.5 items-center transition-colors duration-300 ${
        isDark ? "bg-[#17212b] border-[#24303f]" : "bg-white border-gray-200"
      }`}>
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            placeholder={isAiActive ? "Need cement or rebar? Ask Conbridge AI matchmaker..." : `Type a command or try "@${cleanUsername} cement"...`}
            value={inputText}
            disabled={isAiLoading}
            onChange={(e) => {
              const val = e.target.value;
              setInputText(val);
              const lowerVal = val.toLowerCase();
              const lowerBot = `@${cleanUsername.toLowerCase()}`;
              if (lowerVal.startsWith(lowerBot)) {
                setInlineQuery(val.substring(lowerBot.length).trim());
                setShowInlineResults(true);
              } else {
                setShowInlineResults(false);
              }
            }}
            className={`w-full text-xs rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 ml-0 transition-colors duration-300 ${
              isDark 
                ? "bg-[#101921] border-[#24303f] text-white placeholder-slate-500" 
                : "bg-gray-50 border-gray-200 text-slate-800"
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={isAiLoading}
          className="p-2 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white rounded-full transition cursor-pointer disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
