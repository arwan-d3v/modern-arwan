"use client";

import React, { ButtonHTMLAttributes, AnchorHTMLAttributes, useState, MouseEvent } from "react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "glass";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  asExternal?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  href,
  asExternal,
  children,
  onClick,
  ...props
}: ButtonProps) {
  const [coords, setCoords] = useState({ x: -1, y: -1 });
  const [isRippling, setIsRippling] = useState(false);

  const baseStyles = "relative overflow-hidden inline-flex items-center justify-center font-mono font-bold tracking-widest uppercase transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-accent-cyan text-black hover:bg-accent-cyan/80 shadow-[0_0_15px_rgba(0,242,255,0.4)] hover:shadow-[0_0_25px_rgba(0,242,255,0.6)] border border-accent-cyan",
    secondary: "bg-accent-purple text-white hover:bg-accent-purple/80 shadow-[0_0_15px_rgba(189,0,255,0.4)] hover:shadow-[0_0_25px_rgba(189,0,255,0.6)] border border-accent-purple",
    outline: "bg-transparent text-accent-cyan border border-accent-cyan hover:bg-accent-cyan/10",
    ghost: "bg-transparent text-text-secondary hover:text-accent-cyan hover:bg-white/5",
    glass: "glass text-text-primary hover:border-accent-cyan/50 hover:bg-white/5",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsRippling(true);
    setTimeout(() => setIsRippling(false), 500);
    if (onClick) {
      onClick(e as any);
    }
  };

  const rippleElement = isRippling ? (
    <span
      className="absolute bg-white/30 rounded-full w-24 h-24 -ml-12 -mt-12 animate-ripple pointer-events-none"
      style={{ left: coords.x, top: coords.y }}
    />
  ) : null;

  const combinedClasses = cn(baseStyles, variants[variant], sizes[size], className);

  if (href) {
    if (asExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClasses}
          onClick={handleClick as any}
        >
          {children}
          {rippleElement}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses} onClick={handleClick as any}>
        {children}
        {rippleElement}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} onClick={handleClick as any} {...props}>
      {children}
      {rippleElement}
    </button>
  );
}
