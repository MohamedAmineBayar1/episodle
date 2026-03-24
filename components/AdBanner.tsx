"use client";
import { useEffect, useRef } from "react";

interface AdBannerProps {
  dataAdSlot: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
}

export default function AdBanner({ 
  dataAdSlot, 
  dataAdFormat = "auto", 
  dataFullWidthResponsive = true 
}: AdBannerProps) {
  const adLoaded = useRef(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (!adLoaded.current) {
      // We use a timeout to let the ShareModal's fade-in animation finish
      // to guarantee the container has a >0 width for Google AdSense to read.
      timeoutId = setTimeout(() => {
        try {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          adLoaded.current = true;
        } catch (error: any) {
          console.error("AdSense Error:", error.message);
        }
      }, 400); 
    }

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="w-full min-w-[250px] min-h-[100px] text-center flex justify-center mt-4 pb-2 fade-in rounded-xl">
      <ins
        className="adsbygoogle"
        style={{ display: "block", minWidth: "250px", width: "100%" }}
        data-ad-client="ca-pub-7206404300999787"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      />
    </div>
  );
}
