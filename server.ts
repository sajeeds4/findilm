import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Placeholder API Routes
  // These can be replaced by Django backend calls later
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "FindIlm Backend is running" });
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    // Mock authentication
    if (email && password) {
      res.json({ 
        success: true, 
        user: { id: "1", email, displayName: "User" },
        token: "mock-jwt-token" 
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  app.get("/api/data/daily-ayah", (req, res) => {
    // This could fetch from a real DB or another API
    res.json({
      text: "Verily, with every hardship comes ease.",
      reference: "Ash-Sharh 94:6"
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
