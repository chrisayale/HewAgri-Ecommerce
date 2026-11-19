"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { ToastContainer, toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Create a context for the toast notifications
const ToastContext = createContext<
  (message: string, type?: ToastType, options?: ToastOptions) => void
>(() => {});

type ToastType = "success" | "warning" | "error" | "info";

// ToastProvider Component
export function ToastProvider({ children }: { children: ReactNode }) {
  const notify = (
    message: string,
    type: ToastType = "info",
    options?: ToastOptions
  ) => {
    const defaultOptions: ToastOptions = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      ...options, // Merge with any custom options
    };

    switch (type) {
      case "success":
        toast.success(message, defaultOptions);
        break;
      case "warning":
        toast.warn(message, defaultOptions);
        break;
      case "error":
        toast.error(message, defaultOptions);
        break;
      case "info":
      default:
        toast.info(message, defaultOptions);
        break;
    }
  };

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

// Custom hook to use toast notifications
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("An Error Occurred");
  }
  return context;
}
