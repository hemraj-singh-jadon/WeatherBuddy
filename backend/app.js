import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors"; // ✅ Import cors

const port = process.env.PORT || 8080;

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS for your Cloudflare Pages frontend
app.use(cors({
  origin: 'https://weatherbuddy.pages.dev/',
  methods: ['GET']
}));

// Serve React SPA
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.set("trust proxy", true);

// SPA fallback for frontend routes
app.get("/weather", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Function to get client IP
function getClientIp(req) {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.ip ||
    req.socket.remoteAddress;

  return ip;
}

// API: Detect user location by IP
app.get("/api/location", async (req, res) => {
  const ip = getClientIp(req);

  const isLocal =
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip === "::ffff:127.0.0.1";

  if (isLocal) {
    return res.json({
      city: "New York",
      source: "dev"
    });
  }

  try {
    const r = await axios.get(`https://ipinfo.io/${ip}/json`);
    res.json({
      city: r.data.city,
      source: "ip"
    });
  } catch {
    res.json({
      city: "New York",
      source: "fallback"
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
