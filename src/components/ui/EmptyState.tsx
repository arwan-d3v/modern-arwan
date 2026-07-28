import React from "react";
import { FolderX } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ 
  title = "No Data Found", 
  description = "There are no records to display at this time.", 
  icon = <FolderX size={48} className="text-text-secondary/50 mb-4" />,
  action
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center glass rounded-xl border border-white/5 border-dashed">
      {icon}
      <h3 className="text-lg font-mono font-bold text-white mb-2">{title}</h3>
      <p className="text-text-secondary text-sm max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
