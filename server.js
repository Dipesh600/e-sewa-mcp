import { Server } from "@modelcontextprotocol/sdk/server";
import express from "express";
import dotenv from "dotenv";
import {
  createPaymentSessionService,
  verifyTransactionService,
  refundPaymentService,
  getPaymentStatusService
} from "./services/esewa.js";

dotenv.config();

// Create MCP server instance
const mcpServer = new Server({
  name: "esewa-mcp-server",
  version: "1.0.0"
});

// Map tools → service functions
mcpServer.tool("createPaymentSession", async (input) => {
  return await createPaymentSessionService(input);
});

mcpServer.tool("verifyTransaction", async (input) => {
  return await verifyTransactionService(input);
});

mcpServer.tool("refundPayment", async (input) => {
  return await refundPaymentService(input);
});

mcpServer.tool("getPaymentStatus", async (input) => {
  return await getPaymentStatusService(input);
});

// HTTP server required by MCP
const app = express();
app.use(express.json());

// MCP handler — required for Smithery
app.post("/mcp", async (req, res) => {
  try {
    const response = await mcpServer.handle(req.body);
    res.json(response);
  } catch (err) {
    console.error("MCP Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("✅ eSewa MCP Server is running");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 eSewa MCP Server running on port ${PORT}`);
});
