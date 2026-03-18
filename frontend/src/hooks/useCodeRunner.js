import { useState, useCallback } from "react";
import { PROBLEMS } from "../constants/problems";

export function useCodeRunner(problemTitle, language) {
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);

  const run = useCallback(async (code) => {
    if (language !== "javascript") {
      setOutput({ type: "info", text: `${language} execution is coming soon. Try JavaScript!` });
      return;
    }

    setRunning(true);
    setOutput(null);

    // small delay for UX
    await new Promise((r) => setTimeout(r, 500));

    const logs = [];
    const errors = [];

    try {
      const fakeConsole = {
        log: (...args) => logs.push(args.map((a) => JSON.stringify(a)).join(" ")),
        error: (...args) => errors.push(args.map((a) => JSON.stringify(a)).join(" ")),
        warn: (...args) => logs.push(`⚠ ${args.join(" ")}`),
      };

      // Run in sandboxed new Function
      const fn = new Function("console", code);
      fn(fakeConsole);

      if (errors.length > 0) {
        setOutput({ type: "error", text: errors.join("\n") });
      } else {
        setOutput({ type: "success", lines: logs });
      }
    } catch (err) {
      setOutput({ type: "error", text: err.message });
    } finally {
      setRunning(false);
    }
  }, [language]);

  const clear = useCallback(() => setOutput(null), []);

  return { output, running, run, clear };
}