const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const morgan = require("morgan");
const healthRoutes = require("./routes/health");
const { URL } = require("url");

// Load env vars
if (process.env.NODE_ENV === "test") {
  require("dotenv").config({ path: ".env.test" });
} else {
  require("dotenv").config();
}

const app = express();
app.use(express.json());
app.use(morgan("combined"));
app.use("/health", healthRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the API Gateway! Use the appropriate endpoints for the services.");
});

// Generic proxy configuration with enhanced resilience
const configureProxy = (path, target, rewritePath) => {
  if (!target) {
    throw new Error(`[HPM] Missing "target" for proxy path: ${path}`);
  }

  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { [`^${path}`]: rewritePath },
    selfHandleResponse: true,

    onProxyReq: (proxyReq, req) => {
      console.log(`Forwarding request: ${req.method} ${req.url}`);
    },

    onProxyRes: async (proxyRes, req, res) => {
      let body = "";
      proxyRes.on("data", chunk => {
        body += chunk.toString("utf8");
      });

      proxyRes.on("end", () => {
        try {
          const parsed = JSON.parse(body); // check if valid JSON
          res.status(proxyRes.statusCode).json(parsed);
          console.log(`Response from service: ${proxyRes.statusCode} for ${req.url}`);
        } catch (err) {
          console.error(`Malformed response from target for ${req.url}`);
          res.status(502).json({ error: "Bad Gateway: Malformed JSON from target service" });
        }
      });
    },

    onError(err, req, res) {
      console.error(`Error forwarding request to ${target}: ${err.code || err.message}`);
      if (err.code === "ECONNREFUSED" || err.code === "ECONNRESET") {
        res.status(504).json({ error: "Gateway Timeout: Service unavailable" });
      } else {
        res.status(502).json({ error: "Bad Gateway" });
      }
    }
  });
};

// Proxy routes
app.use("/auth", configureProxy("/auth", process.env.AUTH_SERVICE_URL, "/api/auth"));
app.use("/ward", configureProxy("/ward", process.env.WARD_SERVICE_URL, ""));
app.use("/patient", configureProxy("/patient", process.env.PATIENT_SERVICE_URL, ""));
app.use("/admission", configureProxy("/admission", process.env.ADMISSION_SERVICE_URL, ""));

// Final fallback error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error in API Gateway:", err.message);
  res.status(500).send("Something went wrong in the API Gateway.");
});

module.exports = app;