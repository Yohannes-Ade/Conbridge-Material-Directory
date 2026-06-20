import React, { useState } from "react";
import {
  CheckCircle,
  PlayCircle,
  HelpCircle,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Settings,
  Terminal,
  ExternalLink,
  ChevronDown,
  Info,
  Sliders,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { Supplier } from "../types";

interface InteractiveGuideProps {
  botToken: string;
  setBotToken: (val: string) => void;
  botUsername: string;
  setBotUsername: (val: string) => void;
  appsScriptUrl: string;
  setAppsScriptUrl: (val: string) => void;
  channelLink: string;
  setChannelLink: (val: string) => void;
  githubPagesUrl: string;
  setGithubPagesUrl: (val: string) => void;
  sheetsSuppliers?: Supplier[];
  isFetchingSheets?: boolean;
  sheetsError?: string | null;
  onRefreshSheets?: () => void;
  isDark?: boolean;
}

export default function InteractiveGuide({
  botToken,
  setBotToken,
  botUsername,
  setBotUsername,
  appsScriptUrl,
  setAppsScriptUrl,
  channelLink,
  setChannelLink,
  githubPagesUrl,
  setGithubPagesUrl,
  sheetsSuppliers = [],
  isFetchingSheets = false,
  sheetsError = null,
  onRefreshSheets,
  isDark = false,
}: InteractiveGuideProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStepCompleted = (stepId: number) => {
    if (completedSteps.includes(stepId)) {
      setCompletedSteps(completedSteps.filter((id) => id !== stepId));
    } else {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const steps = [
    { id: 1, title: "Create Telegram Bot", desc: "Interact with @BotFather to register bot & fetch token" },
    { id: 2, title: "Understand Mini App", desc: "Overview of the HTML/JS Web SDK & material templates" },
    { id: 3, title: "Google Sheets Setup", desc: "Deploy Google Apps Script as raw JSON backend" },
    { id: 4, title: "Host on GitHub Pages", desc: "Publish the index.html for free under absolute HTTPS" },
    { id: 5, title: "Link Bot to Mini App", desc: "Set up Bot Father shortlink triggers & menu buttons" },
    { id: 6, title: "Enable Inline Queries", desc: "Unleash @username cement search in any private group" },
    { id: 7, title: "Register Commands", desc: "Configure /start, /register menu items in BotFather" },
    { id: 8, title: "Review Dry-Run Test", desc: "Run simulated test checks before launching to Conbridge" },
    { id: 9, title: "Channel Linkage & Automated Payments", desc: "Configure channel invite links & automated CBE Birr/Chapa checkout webhooks" },
  ];

  const currentProgress = Math.round((completedSteps.length / steps.length) * 100);

  return (
    <div
      id="interactive_guide_panel"
      className={`border rounded-2xl shadow-sm overflow-hidden flex flex-col h-full transition-colors duration-300 ${
        isDark ? "bg-[#17212b] border-[#24303f] dark-mode" : "bg-white border-slate-200"
      }`}
    >
      <style>{`
        #interactive_guide_panel.dark-mode {
          background-color: #17212b !important;
          border-color: #24303f !important;
          color: #e2e8f0 !important;
        }
        #interactive_guide_panel.dark-mode .text-gray-900,
        #interactive_guide_panel.dark-mode .text-gray-800,
        #interactive_guide_panel.dark-mode .text-gray-700,
        #interactive_guide_panel.dark-mode h2,
        #interactive_guide_panel.dark-mode h3 {
          color: #ffffff !important;
        }
        #interactive_guide_panel.dark-mode .text-gray-600,
        #interactive_guide_panel.dark-mode .text-gray-500 {
          color: #a0aec0 !important;
        }
        #interactive_guide_panel.dark-mode .bg-gray-50,
        #interactive_guide_panel.dark-mode .bg-gray-50\\/50 {
          background-color: #111921 !important;
          border-color: #24303f !important;
        }
        #interactive_guide_panel.dark-mode .border-gray-100 {
          border-color: #24303f !important;
        }
        #interactive_guide_panel.dark-mode input {
          background-color: #101921 !important;
          border-color: #24303f !important;
          color: #ffffff !important;
        }
        #interactive_guide_panel.dark-mode .bg-blue-50 {
          background-color: #182533 !important;
          color: #38bdf8 !important;
        }
        #interactive_guide_panel.dark-mode .text-blue-600,
        #interactive_guide_panel.dark-mode .text-blue-700 {
          color: #38bdf8 !important;
        }
        #interactive_guide_panel.dark-mode code,
        #interactive_guide_panel.dark-mode pre {
          background-color: #131c26 !important;
          border-color: #24303f !important;
          color: #fda4af !important;
        }
        #interactive_guide_panel.dark-mode .bg-yellow-50 {
          background-color: #111e2f !important;
          border-color: #2563eb40 !important;
          color: #93c5fd !important;
        }
        #interactive_guide_panel.dark-mode .p-3.5.border {
          border-color: #24303f !important;
        }
      `}</style>
      {/* HEADER SECTION */}
      <div class="p-5 border-b bg-gray-50/50">
        <div class="flex justify-between items-center mb-3">
          <div class="flex items-center gap-2">
            <span class="p-1 px-2.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg uppercase tracking-wide">Developer Companion</span>
            <span class="text-xs text-gray-500 font-semibold text-gray-500">9-Step Walkthrough</span>
          </div>
          <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono font-bold">
            {completedSteps.length}/9 Steps Finished
          </span>
        </div>
        <h1 class="text-lg font-bold text-gray-900 tracking-tight">Active Step Guide & Configurations</h1>
        <p class="text-xs text-gray-500 mt-1">Input your custom configurations below to update code output scripts automatically.</p>

        {/* Global Progress Bar */}
        <div class="mt-4">
          <div class="flex justify-between text-[11px] font-medium text-gray-400 mb-1">
            <span>Overall Setup State</span>
            <span>{currentProgress}% Done</span>
          </div>
          <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${currentProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* COMPANION STATE CONFIGURATION PANEL */}
      <div class="p-4 bg-gray-50/50 border-b grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Bot Token (Step 1)</label>
          <input
            type="text"
            placeholder="Paste your token from @BotFather..."
            value={botToken}
            onChange={(e) => setBotToken(e.target.value)}
            class="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 font-mono ml-0"
          />
        </div>
        <div>
          <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Bot Username (Step 1)</label>
          <input
            type="text"
            placeholder="e.g. ConbridgeConstructionBot (no @)"
            value={botUsername}
            onChange={(e) => setBotUsername(e.target.value)}
            class="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 font-mono ml-0"
          />
        </div>
        <div>
          <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Google Apps Script Web URL (Step 3)</label>
          <div class="flex gap-2">
            <input
              type="text"
              placeholder="Paste your Web App deployment URL..."
              value={appsScriptUrl}
              onChange={(e) => setAppsScriptUrl(e.target.value)}
              class="flex-1 text-xs bg-white border border-gray-200 rounded-lg p-2 font-mono ml-0"
            />
            {appsScriptUrl && (
              <button
                type="button"
                onClick={onRefreshSheets}
                disabled={isFetchingSheets}
                className="px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-95 disabled:opacity-55 text-xs font-semibold rounded-lg shrink-0 transition flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetchingSheets ? "animate-spin" : ""}`} />
                <span>Sync</span>
              </button>
            )}
          </div>
          
          {/* Real-time sync connection status badges */}
          <div class="mt-1.5 text-[10px] leading-relaxed">
            {!appsScriptUrl ? (
              <p class="text-gray-500 flex items-center gap-1 select-none">
                <Info className="w-3 h-3 text-gray-400 shrink-0" />
                <span>Playground mode: Using local mock data. Paste your Apps Script URL to sync live spreadsheets!</span>
              </p>
            ) : isFetchingSheets ? (
              <p class="text-blue-600 flex items-center gap-1 select-none font-medium animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin shrink-0" />
                <span>Connecting and retrieving rows from Google Sheets...</span>
              </p>
            ) : sheetsError ? (
              <div class="bg-red-50 border border-red-100 text-red-600 p-2 rounded-lg mt-1 space-y-1">
                <p class="font-semibold flex items-center gap-1 select-none">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                  <span>CORS Fetch Warning / Connection Failed</span>
                </p>
                <p class="text-[9.5px] text-red-500/90 leading-normal pl-4.5">
                  The browser had trouble connecting to your web app: <strong>{sheetsError}</strong>. 
                  <br />
                  💡 <strong>How to fix:</strong> In Google Sheets, click <em>Extensions &gt; Apps Script &gt; Deploy &gt; Manage Deployments</em>, edit the deployment and configure <strong>Who has access: "Anyone"</strong> (NOT "Anyone with Google Account"). Then deploy a NEW version &amp; copy the web app URL!
                </p>
              </div>
            ) : (
              <p class="text-green-600 font-semibold flex items-center gap-1 py-0.5 select-none">
                <span class="w-2 h-2 bg-green-500 rounded-full shrink-0 animate-pulse"></span>
                <span>Active Sheet Database Link! Loaded {sheetsSuppliers.length} suppliers from your live file.</span>
              </p>
            )}
          </div>
        </div>
        <div>
          <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">GitHub Pages Deployment URL (Step 4)</label>
          <input
              type="text"
              placeholder="e.g., https://yohannes.github.io/app"
              value={githubPagesUrl}
              onChange={(e) => setGithubPagesUrl(e.target.value)}
              class="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 font-mono ml-0"
            />
        </div>
      </div>

      {/* STEP GRID NAV */}
      <div className={`flex border-b overflow-x-auto divide-x text-xs transition-colors duration-300 ${isDark ? "bg-[#111921] border-[#24303f] divide-slate-800" : "bg-white border-gray-100"}`}>
        {steps.map((s) => {
          const isActive = s.id === activeStep;
          const isDone = completedSteps.includes(s.id);

          return (
            <button
              key={s.id}
              onClick={() => setActiveStep(s.id)}
              className={`flex-none py-3 px-4 font-semibold shrink-0 cursor-pointer transition flex items-center gap-1.5 ${
                isActive
                  ? isDark 
                    ? "bg-[#1c2a38] text-blue-400 border-b-2 border-blue-500" 
                    : "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : isDone
                  ? isDark
                    ? "text-[#40b3ff] hover:bg-[#202b36]/50"
                    : "text-green-600 hover:bg-gray-50"
                  : isDark
                    ? "text-slate-400 hover:bg-[#202b36]/50"
                    : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <span>{s.id}.</span>
              {isDone ? <CheckCircle className={`w-3.5 h-3.5 ${isDark ? "text-blue-400" : "text-green-600"}`} /> : null}
              <span>{s.title.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE STEP DETAILS CONTENT */}
      <div class="flex-1 p-5 overflow-y-auto space-y-4">
        {activeStep === 1 && (
          <div class="space-y-4">
            <h2 class="text-base font-bold text-gray-800 flex items-center gap-2">
              <span class="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
              Register Bot with Telegram BotFather
            </h2>

            <p class="text-xs text-gray-600 leading-relaxed">
              Before setting up files, registering suppliers, or loading directory lists, you must establish a legitimate digital identity on Telegram.
            </p>

            <div class="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
              <h3 class="text-xs font-bold text-gray-700 uppercase tracking-wider">Step-By-Step Guide:</h3>
              <ol class="list-decimal pl-4.5 text-xs text-gray-600 space-y-2 leading-relaxed">
                <li>Open your Telegram client and search for the verified profile <a href="https://t.me/BotFather" target="_blank" class="text-blue-600 font-bold hover:underline inline-flex items-center gap-0.5">@BotFather<ExternalLink className="w-3" /></a></li>
                <li>Send the command <code class="bg-gray-200 px-1 py-0.5 rounded text-red-600 font-bold inline-block font-mono">/newbot</code></li>
                <li>When prompted, type a user-facing name, e.g. <span class="font-semibold text-gray-800">Conbridge Construction Material</span></li>
                <li>Choose a permanent username ending with "bot", e.g. <span class="font-mono text-gray-800 bg-gray-100 px-1 rounded">ConbridgeConstructionBot</span>. Save it in the input field above.</li>
                <li>BotFather will print your unique token: <span class="font-mono text-xs text-purple-700 font-bold bg-white p-1 rounded border border-gray-200">123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ</span>. Paste it into the Token field above immediately!</li>
              </ol>
            </div>

            <div class="flex p-3 bg-yellow-50 border border-yellow-100 text-yellow-900 rounded-xl gap-2 text-xs leading-relaxed">
              <Info class="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Channel Administration:</strong> Promote the newly created bot to an <strong>Admin</strong> in your existing public channel. This is mandatory so your channel can host pinned posts of construction catalogue cards.
              </div>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div class="space-y-4">
            <h2 class="text-base font-bold text-gray-800 flex items-center gap-2">
              <span class="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
              Understand the Mini App Web Architecture
            </h2>

            <p class="text-xs text-gray-600 leading-relaxed">
              We have compiled a single-file, production-ready, beautiful HTML/CSS template to act as your Mini App directory. It includes:
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div class="p-3.5 border rounded-xl bg-gray-50/50">
                <span class="font-bold text-blue-700 block mb-1">🏗️ Registration Form Layout</span>
                <span class="text-gray-500 leading-relaxed">Includes fields matching business owner, drop downs (Merkato, Bole, CMC, Lideta), MOQ limits, and multiple checkable material tags.</span>
              </div>
              <div class="p-3.5 border rounded-xl bg-gray-50/50">
                <span class="font-bold text-blue-700 block mb-1">📱 Responsive search results</span>
                <span class="text-gray-500 leading-relaxed">Subscribers browse and search cards by keyword, category filter, and directly initiate Tel links or Telegram text chat handshakes.</span>
              </div>
              <div class="p-3.5 border rounded-xl bg-gray-50/50">
                <span class="font-bold text-blue-700 block mb-1">🎨 Automatic Theme Detection</span>
                <span class="text-gray-500 leading-relaxed">Utilizes official Telegram API WebApp.themeParams to toggle between Light/Dark settings based on the buyer's UI theme.</span>
              </div>
              <div class="p-3.5 border rounded-xl bg-gray-50/50">
                <span class="font-bold text-blue-700 block mb-1">📋 Low-latency CORS fetching</span>
                <span class="text-gray-500 leading-relaxed">Communicates over <code>no-cors</code> channels to pass structural payload rows to free Google Sheets script lines.</span>
              </div>
            </div>

            <p class="text-xs text-gray-500 leading-relaxed">
              To copy or download this file, open the <strong>"Production Code Exports"</strong> section at the top of the app overview page. It automatically updates based on your set Google Sheet API deployment URL.
            </p>
          </div>
        )}

        {activeStep === 3 && (
          <div class="space-y-4">
            <h2 class="text-base font-bold text-gray-800 flex items-center gap-2">
              <span class="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
              Google Sheets Setup & Apps Script Bridge (Free Database)
            </h2>

            <p class="text-xs text-gray-600 leading-relaxed">
              We bypass the friction of managing database servers using a free Google Spreadsheet to store your directory inputs. Follow these instructions exactly:
            </p>

            <div class="bg-gray-50 p-4 rounded-xl space-y-3.5 border border-gray-100 text-xs">
              <ol class="list-decimal pl-4.5 text-gray-600 space-y-2.5 leading-relaxed">
                <li>Create a brand new Google Sheets document (type <a href="https://sheets.new" target="_blank" class="text-blue-600 font-bold hover:underline">sheets.new</a> in your browser).</li>
                <li>Name the spreadsheet <code>Conbridge Supplier DB</code>.</li>
                <li>In the top menu, click <strong>Extensions ➔ Apps Script</strong>.</li>
                <li>Erase any auto-generated code in the editor, and paste the <strong>"Google Apps Script Bridge (database.gs)"</strong> from the Exports panel.</li>
                <li>Click the 💾 (Save) icon at the top of the editor.</li>
                <li>Click <strong>Deploy ➔ New Deployment</strong> at the top right of the page.</li>
                <li>Select the type by clicking the Gear icon next to Select Type, and choose <strong>"Web App"</strong>.</li>
                <li>Configure the deployment parameters:
                  <ul class="list-disc pl-5 mt-1.5 space-y-1 text-gray-500">
                    <li>Description: <code>Construction Directory Backend</code></li>
                    <li>Execute as: <strong>"Me (your-email@gmail.com)"</strong></li>
                    <li>Who has access: <strong>"Anyone"</strong> (🚨 crucial for allowing submissions without login prompts)</li>
                  </ul>
                </li>
                <li>Click <strong>Deploy</strong>. Google will prompt you to "Authorize Access". Review the permissions under your standard Google profile and authorize it.</li>
                <li>Copy the provided <strong>Web App URL</strong> (it ends with <code>/exec</code>) and paste it into the Web URL input box above!</li>
              </ol>

              <div class="mt-4 p-3.5 bg-rose-50 border border-rose-100/75 rounded-xl text-left space-y-1.5">
                <span class="font-bold text-rose-800 text-[11px] uppercase tracking-wide flex items-center gap-1">
                  ⚠️ CRITICAL GOOGLE SHEET SUBMIT WARNING:
                </span>
                <p class="text-gray-700 leading-relaxed text-[11px]">
                  <strong>1. Always create a New Version on edit:</strong> If you edit the spreadsheet Apps Script, Google <strong>will not apply changes</strong> until you deploy again! Go to <strong>Deploy ➔ Manage Deployments</strong>, click the <strong>Pencil (Edit icon)</strong>, select <strong>"New Version"</strong> inside the version list, and click <strong>"Deploy"</strong>.
                </p>
                <p class="text-gray-700 leading-relaxed text-[11px]">
                  <strong>2. "Anyone" Access:</strong> Make sure Who has access is set strictly to <strong>"Anyone"</strong>, NOT "Anyone with Google Account". Otherwise, the submit form will fail validation or request authentication cookies!
                </p>
                <p class="text-gray-700 leading-relaxed text-[11px]">
                  <strong>3. Refresh/Authorize:</strong> If entries don't appear, open your Apps Script URL manually in your browser. You should see a blank JSON array <code>{"{\"status\":\"success\",\"data\":[]}"}</code> which confirms the endpoint is fully responsive and public!
                </p>
                <p class="text-gray-700 leading-relaxed text-[11px]">
                  <strong>4. Sheet-bound container vs Standalone script:</strong> Make sure you created the Apps Script directly from inside your Google Sheet (Extensions ➔ Apps Script). If you create a standalone Apps Script directly from script.google.com, it will not be bound to any spreadsheet and will crash on submission.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeStep === 4 && (
          <div class="space-y-4">
            <h2 class="text-base font-bold text-gray-800 flex items-center gap-2">
              <span class="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">4</span>
              Host Your Mini App on GitHub Pages for Free
            </h2>

            <p class="text-xs text-gray-600 leading-relaxed">
              Your HTML Mini App must be hosted on an HTTPS secured server to legally open inside the Telegram iframe layout. GitHub Pages is free and takes under 3 minutes:
            </p>

            <div class="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100 text-xs">
              <ol class="list-decimal pl-4.5 text-gray-600 space-y-2 leading-relaxed">
                <li>Go to <a href="https://github.com" target="_blank" class="text-blue-600 font-bold hover:underline">github.com</a> and sign in (or create a free account).</li>
                <li>Click <strong>"New"</strong> or visit <a href="https://github.com/new" target="_blank" class="text-blue-600 hover:underline">github.com/new</a> to create a public repository.</li>
                <li>Name your repository: <code>conbridge-material-directory</code>. Keep it "Public".</li>
                <li>Click original creation files link and select <strong>"uploading an existing file"</strong>, then upload your customized <code>index.html</code> (available in the Code Export pane).</li>
                <li>Commit changes to the <code>main</code> branch.</li>
                <li>In your repository, head over to <strong>Settings</strong> (gear icon in the top utility bar) ➔ <strong>Pages</strong> in the left sidebar.</li>
                <li>Under Build and Deployment, set Source to <strong>"Deploy from a branch"</strong>. Branch ➔ <strong>"main"</strong> ➔ click <strong>Save</strong>.</li>
                <li>Wait 1-2 minutes, refresh the browser page. A banner will emerge: <span class="bg-green-100 text-green-900 px-1 py-0.5 rounded font-mono text-[11px] font-semibold">Your site is live at https://[username].github.io/conbridge-material-directory/</span>.</li>
                <li>Copy that secure HTTPS link, paste it in the GitHub URL configurations above!</li>
              </ol>
            </div>
          </div>
        )}

        {activeStep === 5 && (
          <div class="space-y-4">
            <h2 class="text-base font-bold text-gray-800 flex items-center gap-2">
              <span class="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">5</span>
              Connect Your Web Page to the Bot as a Mini App
            </h2>

            <p class="text-xs text-gray-600 leading-relaxed">
              Now we bind your GitHub hosted HTTPS link inside @BotFather so it can load instantly on client interaction.
            </p>

            <div class="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100 text-xs">
              <ol class="list-decimal pl-4.5 text-gray-600 space-y-2 leading-relaxed">
                <li>Go back to <a href="https://t.me/BotFather" target="_blank" class="text-blue-600 font-bold hover:underline">@BotFather</a>.</li>
                <li>Send the command <code class="bg-gray-200 px-1 rounded text-red-600 font-mono">/newapp</code>. Select your matching bot.</li>
                <li>Type an attractive title: <code>Conbridge Materials App</code>. Give it a short summary.</li>
                <li>Upload an app square icon image (GIF/PNG of size 512x512) and a splash screen image.</li>
                <li>When prompted for the Web App URL, paste your <strong>GitHub Pages HTTPS link</strong> (e.g. <code>https://username.github.io/conbridge-material-directory/</code>).</li>
                <li>Choose an easy short name, e.g. <code>directory</code>. Your mini app link is generated! (e.g., <code>t.me/ConbridgeConstructionBot/directory</code>)</li>
                <li>To bind this as the main bottom-left key, send <code class="bg-gray-200 px-1 rounded text-red-600 font-mono">/setmenubutton</code>, select your bot, enter your app link, and choose menu label: <strong>"Directory 🏗️"</strong></li>
              </ol>
            </div>
          </div>
        )}

        {activeStep === 6 && (
          <div class="space-y-4">
            <h2 class="text-base font-bold text-gray-800 flex items-center gap-2">
              <span class="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">6</span>
              Unleash Inline Searches in Any Chat room
            </h2>

            <p class="text-xs text-gray-600 leading-relaxed">
              Subscribers should be able to query the Google sheets supplier directory on-the-fly directly within any team group chat, individual room, or channels.
            </p>

            <div class="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100 text-xs">
              <ol class="list-decimal pl-4.5 text-gray-600 space-y-2 leading-relaxed">
                <li>Return to <a href="https://t.me/BotFather" target="_blank" class="text-blue-600 font-bold hover:underline">@BotFather</a></li>
                <li>Send command <code class="bg-gray-200 px-1 rounded text-red-600 font-mono">/setinline</code>. Select your active bot.</li>
                <li>Enter the default query placeholder instruct: <code>Search Conbridge Cement, Steel, Rebar, Paint Wholesalers...</code></li>
                <li>Now, compile and deploy the Node.js source script found in our Exports tab (bot.js) as a free background worker on Railway (railway.app), Render (render.com) or Glitch (glitch.com).</li>
                <li>Make sure to set environment variables on the console:
                  <ul class="list-disc pl-5 mt-1 space-y-1 text-gray-500">
                    <li>`BOT_TOKEN`: Your real token string</li>
                    <li>`GOOGLE_SHEET_MIDDLEWARE`: Your Apps Script URL</li>
                  </ul>
                </li>
              </ol>
            </div>
          </div>
        )}

        {activeStep === 7 && (
          <div class="space-y-4">
            <h2 class="text-base font-bold text-gray-800 flex items-center gap-2">
              <span class="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">7</span>
              Add Command Shortcuts
            </h2>

            <p class="text-xs text-gray-600 leading-relaxed">
              Standardize keyboard command suggestions so buyers and traders know how to interact with your server instantly.
            </p>

            <div class="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100 text-xs">
              <p class="text-gray-600 font-medium">Send <code class="bg-gray-200 px-1.5 py-0.5 rounded text-red-600 font-mono">/setcommands</code> in @BotFather, pick your bot username, then copy-paste the exact lines below:</p>
              <pre class="bg-gray-950 text-gray-100 hover:text-white p-3.5 rounded-lg text-[11px] font-mono select-all">
{`start - Open the Directory App launcher
register - Open supplier registration portal
directory - Search building materials in Conbridge
prices - Weekly construction market updates
tenders - Conbridge active builders tenders
help - Customer support guide`}
              </pre>
            </div>
          </div>
        )}

        {activeStep === 8 && (
          <div class="space-y-4">
            <h2 class="text-base font-bold text-gray-800 flex items-center gap-2">
              <span class="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">8</span>
              Interactive dry-run checklist
            </h2>

            <p class="text-xs text-gray-600 leading-relaxed">
              Congratulations! Your construction guide system is structurally ready to launch. Tick all the live parameters in the preview simulator on the left to ensure perfect output delivery!
            </p>

            <div class="space-y-2.5">
              {[
                "Web app loads inside simulated iPhone chassis",
                "Successfully toggled dark theme mode for eye-safe viewing",
                "Submitted mock supplier and observed database updates",
                "Queried search box using term 'Cement' or area 'Bole'",
                "Simulated /start bot command inside the chatbot pane",
                "Performed block checks inside the Telegram Channel feed",
                "Set appsScriptUrl and confirmed Code Exports updated accordingly"
              ].map((item, idx) => (
                <label key={idx} class="flex items-start gap-2.5 p-2 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition text-xs">
                  <input type="checkbox" className="mt-0.5 text-blue-600 rounded" />
                  <span class="text-gray-600 font-medium">{item}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {activeStep === 9 && (
          <div className="space-y-4">
            <h2 class="text-base font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs text-center leading-none">9</span>
              High-Conversion Channel Linkage & Payment Automation
            </h2>

            <p className="text-xs text-gray-605 text-gray-400 dark:text-gray-300 leading-relaxed">
              To maximize members joining your directory and listing their products, you must link the bot and App using high-converting, interactive visual triggers directly within your public channel.
            </p>

            <div className="p-4 rounded-xl space-y-4 bg-gray-50 border border-gray-100 text-xs">
              <div className="space-y-1.5 text-left">
                <h4 className="font-extrabold text-blue-600 uppercase text-[10.5px]">
                  1. Hook the Mini App directly to Channel posts (Post buttons):
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[11px]">
                  Do not just post simple plaintext links! The absolute best way to link the App on Telegram is by using <strong>Inline Web App Keyboard Buttons</strong> on your main channel posts. When members click them, the layout slides up inside their Telegram channel instantly.
                </p>
                <div className="p-3 bg-gray-950 text-gray-200 rounded-lg text-[10.5px] font-mono leading-relaxed select-all">
                  <strong>How to configure:</strong> Attach an inline keyboard layout directly to channel broadcast signals:
                  <ul className="list-disc pl-4 mt-1.5 text-gray-400 space-y-1">
                    <li>Button Text: <code>"🚀 List My Products Now"</code></li>
                    <li>WebApp Trigger URL: <code>t.me/{botUsername || "yourbotusername"}/directory</code></li>
                  </ul>
                </div>
              </div>

              <div className="space-y-1.5 border-t border-gray-400/10 pt-3 text-left">
                <h4 className="font-extrabold text-teal-600 uppercase text-[10.5px]">
                  2. Chapa, CBE Birr & Telebirr Webhook Setup:
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[11px]">
                  Since you require suppliers to pay before listings are validated, you can integrate secure online checkouts. In a production environment:
                </p>
                <ol className="list-decimal pl-4.5 text-gray-500 space-y-1 ml-0.5 leading-relaxed text-[10.5px]">
                  <li><strong>Chapa (CBE Birr & Card Gateway):</strong> Sign up on <a href="https://chapa.co" target="_blank" className="text-blue-600 font-bold hover:underline">Chapa.co</a>. Invoke Chapa's <code>/transaction/initialize</code> API from your Node.js background helper. Direct users to the interactive pay portal.</li>
                  <li><strong>Telebirr Webhook:</strong> Secure custom public keys from Ethio Telecom. Query payment prompt requests to automatically pop up USSD codes on supplier smartphones.</li>
                  <li><strong>Automated DB validation:</strong> Once Chapa triggers a <code>"success"</code> payload response to your server webhook, set <code>paymentStatus: "paid"</code> in the sheet row. This immediately validates premium directory badging & posts notifications!</li>
                </ol>
              </div>

              <div className="p-3.5 bg-yellow-50 dark:bg-[#111e2f] border border-blue-500/10 rounded-xl leading-relaxed text-[10.5px] text-left text-gray-600 dark:text-blue-300">
                💡 Try the <strong>"Materials Directory"</strong> registration screen on the left to see this premium system in action! You can authorize mock Telebirr / Card gates, trace simulator webhooks, and compile official stamps.
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM STEP CONTROLS */}
        <div class="flex justify-between items-center pt-4 border-t border-gray-100">
          <button
            onClick={() => toggleStepCompleted(activeStep)}
            className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition select-none cursor-pointer ${
              completedSteps.includes(activeStep)
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            {completedSteps.includes(activeStep) ? "✓ Done! (Click to redo)" : "✓ Mark This Step Form Done"}
          </button>

          <div class="flex gap-2">
            <button
              onClick={() => activeStep > 1 && setActiveStep(activeStep - 1)}
              disabled={activeStep === 1}
              class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold disabled:opacity-40 transition cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={() => activeStep < 9 && setActiveStep(activeStep + 1)}
              disabled={activeStep === 9}
              class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold disabled:opacity-40 transition cursor-pointer flex items-center gap-1"
            >
              Next <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
