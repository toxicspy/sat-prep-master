/**
 * AdSlot — Reusable ad placement component.
 *
 * Supports multiple ad formats: banner, leaderboard, rectangle, in-article, sidebar.
 * Only renders when an ad unit ID is configured in AD_CONFIG.
 * Replace the placeholder ad unit IDs with real Google AdSense / Ad Manager IDs.
 *
 * Usage: <AdSlot format="banner" />
 */

// ── Ad configuration ──────────────────────────────────────────
// Set ad unit IDs here. Leave empty string to hide that slot.
export const AD_CONFIG: Record<string, string> = {
  /** 728×90 leaderboard — top of page */
  leaderboard: "",
  /** 320×50 mobile banner */
  banner: "",
  /** 300×250 medium rectangle — sidebar / in-content */
  rectangle: "",
  /** In-article native ad */
  "in-article": "",
  /** 160×600 wide skyscraper — sidebar */
  sidebar: "",
};

// ── Dimensions per format ─────────────────────────────────────
const FORMAT_STYLES: Record<string, { width: string; height: string; responsiveClass: string }> = {
  leaderboard: { width: "728px", height: "90px", responsiveClass: "hidden md:block" },
  banner: { width: "320px", height: "50px", responsiveClass: "block md:hidden" },
  rectangle: { width: "300px", height: "250px", responsiveClass: "" },
  "in-article": { width: "100%", height: "auto", responsiveClass: "" },
  sidebar: { width: "160px", height: "600px", responsiveClass: "hidden lg:block" },
};

interface AdSlotProps {
  /** Ad format type */
  format: keyof typeof FORMAT_STYLES;
  /** Additional wrapper classes */
  className?: string;
}

const AdSlot = ({ format, className = "" }: AdSlotProps) => {
  const adUnitId = AD_CONFIG[format];

  // Don't render if no ad unit is configured for this format
  if (!adUnitId) return null;

  const style = FORMAT_STYLES[format] || FORMAT_STYLES.rectangle;

  return (
    <div
      className={`ad-slot flex items-center justify-center mx-auto ${style.responsiveClass} ${className}`}
      style={{ maxWidth: style.width, minHeight: style.height }}
      aria-hidden="true"
      data-ad-format={format}
      data-ad-unit={adUnitId}
    >
      {/*
        Google AdSense integration:
        Replace the inner div with your actual ad code, e.g.:
        <ins className="adsbygoogle"
          style={{ display: "block", width: style.width, height: style.height }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={adUnitId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        Then call (window.adsbygoogle = window.adsbygoogle || []).push({}) in useEffect.
      */}
      <div
        className="bg-muted/50 border border-dashed border-border rounded-lg flex items-center justify-center text-xs text-muted-foreground"
        style={{ width: "100%", height: style.height === "auto" ? "100px" : style.height }}
      >
        Ad · {format}
      </div>
    </div>
  );
};

export default AdSlot;
