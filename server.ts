import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parse incoming JSON request bodies
  app.use(express.json());

  // API Route FIRST - Matches buyer inquiries against list of Google Sheet/local suppliers
  app.post("/api/match-buyer", async (req: express.Request, res: express.Response) => {
    try {
      const { query, suppliers } = req.body;
      if (!query || !suppliers) {
        return res.status(400).json({ error: "Missing query or suppliers data" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      
      // If API key is not ready, fall back to a helpful guiding mock responder (avoids server crashes)
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
        console.warn("GEMINI_API_KEY is not configured in environment secrets.");
        
        // Construct a generic list analysis fallback
        const matches = suppliers.filter((s: any) => {
          const q = query.toLowerCase();
          return (
            s.businessName.toLowerCase().includes(q) ||
            s.location.toLowerCase().includes(q) ||
            s.categories.some((c: string) => c.toLowerCase().includes(q)) ||
            s.products.some((p: any) => p.name.toLowerCase().includes(q))
          );
        });

        const matchText = matches.map((s: any) => 
          `• *${s.businessName}* (📍 ${s.location})
  📞 Contact: ${s.contactName} (${s.phone})
  📦 Min Order: ${s.minOrder}
  🚛 Delivery: ${s.delivery}`
        ).join("\n\n");

        return res.json({
          text: `🤖 *Conbridge AI Matchmaker (Offline Simulator)*

🔑 *Notice:* Please set your real \`GEMINI_API_KEY\` in the **Settings > Secrets** panel to unlock full smart reasoning, price estimates, and intelligent conversational matches!

🔍 *Local Match Results for "${query}":*
Matches Found: ${matches.length}

${matches.length > 0 ? matchText : "No exact matches found. Try queries like 'cement' or 'rebar'."}`
        });
      }

      // Initialize the official Google Gen AI Client
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `You are the "Conbridge Construction Material AI Matchmaker Bot" of Addis Ababa, Ethiopia. 
Your task is to match a buyer's query against our registered construction wholesalers, many of which are fetched live from their Google Sheets.

Under all conditions, your response MUST be helpful, precise, formatted in neat Markdown with emojis, and use standard retail construction terms of Ethiopia (e.g. ETB, Bags, Birr, etc.).

Here is the list of active wholesalers:
${JSON.stringify(suppliers, null, 2)}

Buyer query or matching request: "${query}"

Please analyze:
1. What material category or specific item the buyer is looking for (e.g., Cement, Rebar, Hollow Blocks, Sanitary, Tiles, Gravel, Sand, etc.).
2. Their location compared to the supplier's location (Merkato, Bole, Lideta, Saris, Kality, etc.). Off-site or delivery requests.
3. Quantity and minimum order quantities (MOQ).

Determine if we have any matching suppliers:
- If there are direct or partial matches:
  - Identify the best supplier(s), highlight their product prices, contact info, and why they fit.
  - Calculate a cost estimate if the user specified a quantity. E.g., if they ask for "150 bags of cement", and a matched supplier sells cement for 650 ETB/bag, calculate 150 * 650 = 97,500 ETB, and explicitly mention minimum order checks.
  - Present the final recommendation clearly. Include their phone number and telegram handle!
- If no clear match exists:
  - List the closest alternative materials, or suggest what category fits.
  - Provide guidance on typical market prices (e.g., Cement is 600-680 ETB, Rebar is 4500-8500 ETB depending on size).

Format the response beautifully for Telegram chat style with headers and lists. Use bold text, bullet points of suppliers, and distinct sections. Ensure no technical JSON metadata, brackets, or system details are outputted. Keep it professional and warm.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API matching error:", error);
      res.status(500).json({ error: error.message || "Internal GenAI matching error" });
    }
  });

  // Serve Vite application in development or compiled static assets in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on port ${PORT}`);
  });
}

startServer();
