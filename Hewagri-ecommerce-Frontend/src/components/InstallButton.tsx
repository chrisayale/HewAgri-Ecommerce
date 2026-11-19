"use client";

import { useToast } from "@/context";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import React, {
  ReactEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";

// Define the BeforeInstallPromptEvent type
interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallButton = () => {
  const notify = useToast();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installVisible, setInstallVisible] = useState(false);

  // Handle the beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault(); // Prevent mini-infobar from appearing
      setDeferredPrompt(e); // Store the event for later use
      setInstallVisible(true); // Show install promotion
      // console.log(`'beforeinstallprompt' event was fired.`);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  // Use useCallback to memoize the function and prevent re-renders
  const handleInstallClick = useCallback(async () => {
    if (!deferredPrompt) return;

    setInstallVisible(false); // Hide promotion
    deferredPrompt.prompt(); // Show the native install prompt

    const { outcome } = await deferredPrompt.userChoice; // Handle user choice
    console.log(`User response to the install prompt: ${outcome}`);

    setDeferredPrompt(null); // Reset the event
  }, [deferredPrompt]);

  // Handle appinstalled event
  useEffect(() => {
    const handleAppInstalled = () => {
      console.log("PWA was installed");
      setDeferredPrompt(null); // Clear stored event
      setInstallVisible(false); // Hide promotion if visible
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  if (!installVisible) return null;

  return (
    <>
      {/* {deferredPrompt && ( */}
      <button
        className="bg-orange-400 py-1.5 text-[14px] px-3 flex flex-row items-center justify-center md:space-x-2 rounded-md text-white"
        id="setup_button"
        aria-label="install app"
        title="Install app"
        onClick={handleInstallClick}
        // disabled={!deferredPrompt}
        type="button"
      >
        <span className="hidden md:block notranslate">Installer</span>
        <ArrowDownTrayIcon className="w-5 h-5 animate-bounce" />
      </button>
      {/* )} */}
    </>
  );
};

export default InstallButton;
