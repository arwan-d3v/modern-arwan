"use client";

import { useEffect, useRef, useState } from "react";

const INITIAL_LOGS = [
  "[SYSTEM] Initialization sequence started...",
  "[INFO] Core modules loaded: 100%",
  "[INFO] Establishing secure tunnel to VPS-01...",
  "[SUCCESS] Connection stable. Latency: 12ms",
];

const MOCK_MESSAGES = [
  "[INFO] MikroTik 52ac: Health check OK, Ping 12ms",
  "[EXEC] MT5 Enigma v3: Logic Martingale sequence initiated on XAUUSD",
  "[SUCCESS] VPS-01: Deployment via Git completed",
  "[WARN] High volatility detected on BTCUSD. Risk protocols active.",
  "[INFO] Node-07: Resource usage optimized. CPU: 14%, RAM: 22%",
  "[EXEC] Executing algorithmic rebalancing on Portfolio-A",
  "[INFO] Security scan completed: 0 threats found.",
  "[SYSTEM] Kernel integrity verified.",
];

export default function LiveTerminalLog() {
  const [logs, setLogs] = useState<string[]>(INITIAL_LOGS);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newMessage = MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];
      const timestamp = new Date().toLocaleTimeString([], { hour12: false });
      setLogs((prev) => [...prev, `[${timestamp}] ${newMessage}`]);
    }, Math.random() * 1500 + 1500); // 1.5 to 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full h-full bg-black border border-surface rounded-lg flex flex-col overflow-hidden font-mono text-xs">
      <div className="bg-surface/30 px-4 py-2 border-b border-surface flex justify-between items-center">
        <span className="text-text-secondary uppercase tracking-widest text-[10px] font-bold">Live System Logs</span>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
        </div>
      </div>
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 scroll-smooth custom-scrollbar"
      >
        {logs.map((log, index) => (
          <div key={index} className="flex gap-2">
            <span className="text-accent-cyan opacity-50 shrink-0">{">"}</span>
            <span className={log.includes("[SUCCESS]") ? "text-green-400" : log.includes("[WARN]") ? "text-yellow-400" : log.includes("[EXEC]") ? "text-accent-purple" : "text-text-primary"}>
              {log}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #161618;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #00F2FF;
        }
      `}</style>
    </div>
  );
}
