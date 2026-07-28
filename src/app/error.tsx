"use client";

import { useEffect } from "react";
import { Terminal, RefreshCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Runtime Exception:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      <div className="absolute top-1/4 -right-20 w-72 h-72 bg-red-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="glass p-12 max-w-lg w-full flex flex-col items-center text-center border-red-500/20">
        <Terminal size={48} className="text-red-500 mb-6" />
        
        <h2 className="text-2xl font-mono uppercase tracking-widest text-white mb-4">
          SYSTEM_FAILURE
        </h2>
        
        <p className="text-text-secondary mb-8 font-mono text-sm leading-relaxed">
          An unexpected error occurred in the application matrix. The system failed to process your request.
        </p>

        <button
          onClick={() => reset()}
          className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 font-mono font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors"
        >
          <RefreshCcw size={16} /> Retry Process
        </button>
      </div>
    </div>
  );
}
