const { spawn } = require("child_process");
const { PythonShell } = require("python-shell");
const path = require("path");
const fs = require("fs");

// Load environment variables
require("dotenv").config();

// Import models and utilities
const { getFertilizerRecommendation } = require("../models/fertilizerModel");
const { getPestDetection } = require("../models/pestModel");
const { getMarketPrices } = require("../models/marketModel");
const { generateAdvisory } = require("../models/advisoryModel");
const { textToSpeech } = require("../utils/tts");

exports.handler = async function (event, context) {
  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    // Parse the request body
    let body = {};
    if (event.body) {
      body = JSON.parse(event.body);
    }

    // Route requests based on the path
    const path = event.path.replace("/.netlify/functions/api", "");

    switch (path) {
      case "/fertilizer":
        if (event.httpMethod !== "POST") {
          return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: "Method not allowed" }),
          };
        }
        const fertilizerData = await getFertilizerRecommendation(body);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(fertilizerData),
        };

      case "/pest-detect":
        if (event.httpMethod !== "POST") {
          return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: "Method not allowed" }),
          };
        }
        const pestData = await getPestDetection(body);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(pestData),
        };

      case "/market-prices":
        if (event.httpMethod !== "GET") {
          return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: "Method not allowed" }),
          };
        }
        const prices = await getMarketPrices(event.queryStringParameters);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(prices),
        };

      case "/advisory":
        if (event.httpMethod !== "POST") {
          return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: "Method not allowed" }),
          };
        }
        const advisory = await generateAdvisory(body);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(advisory),
        };

      case "/tts":
        if (event.httpMethod !== "POST") {
          return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: "Method not allowed" }),
          };
        }
        const audioData = await textToSpeech(body.text, body.language || "en");
        return {
          statusCode: 200,
          headers: {
            ...headers,
            "Content-Type": "audio/mpeg",
          },
          body: audioData.toString("base64"),
          isBase64Encoded: true,
        };

      default:
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: "Endpoint not found" }),
        };
    }
  } catch (error) {
    console.error("API Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
    };
  }
};

// Helper function to run Python scripts
const runPythonScript = (scriptName, args = {}) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(
      __dirname,
      "..",
      "scripts",
      `${scriptName}.py`
    );

    if (!fs.existsSync(scriptPath)) {
      return reject(new Error(`Script ${scriptName}.py not found`));
    }

    const pythonProcess = spawn("python", [scriptPath, JSON.stringify(args)]);
    let result = "";
    let error = "";

    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0 || error) {
        return reject(new Error(`Python script error: ${error}`));
      }
      try {
        resolve(JSON.parse(result));
      } catch (e) {
        resolve(result || "Success");
      }
    });
  });
};
