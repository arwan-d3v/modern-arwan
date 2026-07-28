"use client";

import { useEffect } from "react";
import { Terminal, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical Global Exception:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-[#ededed] antialiased">
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
          <div className="border border-red-500/20 bg-[#0e0e10]/80 backdrop-blur-md p-12 max-w-lg w-full flex flex-col items-center text-center rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <Terminal size={48} className="text-red-500 mb-6" />
            
            <h2 className="text-2xl font-mono uppercase tracking-widest text-white mb-4">
              FATAL_SYSTEM_ERROR
            </h2>
            
            <p className="text-gray-400 mb-8 font-mono text-sm leading-relaxed">
              A catastrophic failure occurred in the root layout. Core components failed to mount.
            </p>

            <button
              onClick={() => reset()}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 font-mono font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors"
            >
              <RefreshCcw size={16} /> Reboot System
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
