"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setShowBanner(true);
  }, []);

  const handleConsent = (status: "accepted" | "declined") => {
    localStorage.setItem("cookie-consent", status);
    setShowBanner(false);
    if (status === "declined") {
      // Logic to disable Clarity/Ads for this session
      // @ts-ignore
      window['clarity']?.('consent', false);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:max-w-sm bg-gray-900 text-white p-6 rounded-lg shadow-2xl border border-gray-700 z-50">
      <p className="text-sm mb-4">
        We use cookies and <span className="text-purple-400 font-bold">Microsoft Clarity</span> to see how you play Episodle. This helps us fix bugs and keep the game free!
      </p>
      <div className="flex gap-3">
        <button 
          onClick={() => handleConsent("accepted")}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-medium transition"
        >
          Accept
        </button>
        <button 
          onClick={() => handleConsent("declined")}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded font-medium transition"
        >
          Decline
        </button>
      </div>
      <div className="mt-2 text-center">
        <Link prefetch={false} href="/privacy" className="text-xs text-gray-400 hover:text-white underline transition-colors">
          Read Privacy Policy
        </Link>
      </div>
    </div>
  );
}
