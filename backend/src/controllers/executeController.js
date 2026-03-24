import { ENV } from "../lib/env.js";

const ONECOMPILER_API_URL = "https://api.onecompiler.com/v1/run";

const LANGUAGE_CONFIG = {
  javascript: {
    language: "nodejs",
    fileName: "main.js",
  },
  python: {
    language: "python",
    fileName: "main.py",
  },
  java: {
    language: "java",
    fileName: "Solution.java",
  },
  cpp: {
    language: "cpp",
    fileName: "main.cpp",
  },
};

export async function executeCode(req, res) {
  try {
    const { language, code } = req.body;

    if (!language || !code) {
      return res.status(400).json({
        success: false,
        error: "Language and code are required",
      });
    }

    const config = LANGUAGE_CONFIG[language];

    if (!config) {
      return res.status(400).json({
        success: false,
        error: `Unsupported language: ${language}`,
      });
    }

    if (!ENV.ONECOMPILER_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "OneCompiler API key is missing",
      });
    }

    const response = await fetch(ONECOMPILER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": ENV.ONECOMPILER_API_KEY,
      },
      body: JSON.stringify({
        language: config.language,
        files: [
          {
            name: config.fileName,
            content: code,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data?.message || data?.error || "Code execution failed",
      });
    }

    const stdout = data?.stdout || "";
    const stderr = data?.stderr || "";
    const exception = data?.exception || "";
    const error = data?.error || "";

    if (stderr || exception || error) {
      return res.status(200).json({
        success: false,
        output: stdout,
        error: stderr || exception || error,
      });
    }

    return res.status(200).json({
      success: true,
      output: stdout || "No output",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to execute code",
    });
  }
}
