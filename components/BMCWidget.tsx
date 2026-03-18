"use client";

import { useEffect } from "react";

export default function BMCWidget() {
  useEffect(() => {
    // Prevent multiple injections
    if (document.getElementById("bmc-wbtn")) return;
    
    if (document.querySelector('script[src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"]')) return;
    
    const script = document.createElement("script");
    script.src = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";
    script.setAttribute("data-name", "BMC-Widget");
    script.setAttribute("data-cfasync", "false");
    script.setAttribute("data-id", "TfrozenT");
    script.setAttribute("data-description", "Support me on Buy me a coffee!");
    script.setAttribute(
      "data-message",
      "Can't guess today's show? Maybe a coffee for the dev will bring you better luck tomorrow! 😉☕"
    );
    script.setAttribute("data-color", "#FF813F");
    script.setAttribute("data-position", "Right");
    script.setAttribute("data-x_margin", "18");
    script.setAttribute("data-y_margin", "18");
    script.async = true;
    
    // BMC widget looks for DOMContentLoaded, which has already fired for React.
    // Trigger it manually when the script finishes loading.
    script.onload = () => {
      const evt = new Event("DOMContentLoaded", { bubbles: true, cancelable: true });
      document.dispatchEvent(evt);
    };

    // Append to body immediately mounts widget
    document.body.appendChild(script);

    return () => {
      // Optional: Cleanup if React unmounts component
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      const bmcBtn = document.getElementById("bmc-wbtn");
      if (bmcBtn && bmcBtn.parentNode) {
        bmcBtn.parentNode.removeChild(bmcBtn);
      }
    };
  }, []);

  return null;
}
