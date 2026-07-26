"use client";

import { useState, useCallback, useRef } from "react";
import { FirebaseError } from "firebase/app";

export type AsyncStatus = "idle" | "loading" | "success" | "warning" | "error" | "waiting" | "fail";

export interface AsyncState<T = unknown> {
  status: AsyncStatus;
  data: T | null;
  error: string | null;
  errorCode: string | null;
}

export interface UseAsyncStateOptions {
  successDuration?: number; // ms before auto-reset to idle
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
}

function parseError(err: unknown): { message: string; code: string } {
  if (err instanceof FirebaseError) {
    const codeMap: Record<string, string> = {
      "auth/user-not-found": "No account found with this email address.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/invalid-credential": "Invalid credentials. Check your email and password.",
      "auth/too-many-requests": "Too many failed attempts. Account temporarily locked.",
      "auth/email-already-in-use": "This email is already registered.",
      "auth/network-request-failed": "Network error. Check your connection.",
      "auth/popup-closed-by-user": "Sign-in cancelled. The popup was closed.",
      "auth/cancelled-popup-request": "Sign-in cancelled.",
      "permission-denied": "Access denied. You don't have permission for this action.",
      "unavailable": "Service temporarily unavailable. Retrying...",
    };
    return {
      message: codeMap[err.code] || err.message,
      code: err.code,
    };
  }
  if (err instanceof Error) {
    return { message: err.message, code: "UNKNOWN_ERROR" };
  }
  return { message: "An unexpected error occurred.", code: "UNKNOWN_ERROR" };
}

export function useAsyncState<T = unknown>(options: UseAsyncStateOptions = {}) {
  const { successDuration = 1500, onSuccess, onError } = options;
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [state, setState] = useState<AsyncState<T>>({
    status: "idle",
    data: null,
    error: null,
    errorCode: null,
  });

  const setLoading = useCallback(() => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    setState({ status: "loading", data: null, error: null, errorCode: null });
  }, []);

  const setSuccess = useCallback((data: T | null = null) => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    setState({ status: "success", data, error: null, errorCode: null });
    onSuccess?.(data);
    if (successDuration > 0) {
      resetTimerRef.current = setTimeout(() => {
        setState(prev => prev.status === "success" ? { ...prev, status: "idle" } : prev);
      }, successDuration);
    }
  }, [successDuration, onSuccess]);

  const setWarning = useCallback((message: string) => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    setState({ status: "warning", data: null, error: message, errorCode: "WARNING" });
  }, []);

  const setError = useCallback((err: unknown) => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    const { message, code } = parseError(err);
    setState({ status: "error", data: null, error: message, errorCode: code });
    onError?.(message);
  }, [onError]);

  const setFail = useCallback((err: unknown) => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    const { message, code } = parseError(err);
    setState({ status: "fail", data: null, error: message, errorCode: code });
    onError?.(message);
  }, [onError]);

  const setWaiting = useCallback(() => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    setState(prev => ({ ...prev, status: "waiting" }));
  }, []);

  const reset = useCallback(() => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    setState({ status: "idle", data: null, error: null, errorCode: null });
  }, []);

  const execute = useCallback(async <R = T>(
    asyncFn: () => Promise<R>,
    opts?: { successData?: R }
  ): Promise<R | null> => {
    setLoading();
    try {
      const result = await asyncFn();
      setSuccess((opts?.successData ?? result) as T);
      return result;
    } catch (err) {
      setError(err);
      return null;
    }
  }, [setLoading, setSuccess, setError]);

  return {
    ...state,
    isIdle: state.status === "idle",
    isLoading: state.status === "loading",
    isSuccess: state.status === "success",
    isWarning: state.status === "warning",
    isError: state.status === "error",
    isWaiting: state.status === "waiting",
    isFail: state.status === "fail",
    isBusy: state.status === "loading" || state.status === "waiting",
    setLoading,
    setSuccess,
    setWarning,
    setError,
    setFail,
    setWaiting,
    reset,
    execute,
  };
}
