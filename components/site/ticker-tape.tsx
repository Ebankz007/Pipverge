"use client";

import * as React from "react";

const PRO_MAP: Record<string, { proName: string; title: string }> = {
  "EUR/USD": { proName: "FX:EURUSD", title: "EUR/USD" },
  "GBP/USD": { proName: "FX:GBPUSD", title: "GBP/USD" },
  "USD/JPY": { proName: "FX:USDJPY", title: "USD/JPY" },
  "XAU/USD": { proName: "OANDA:XAUUSD", title: "Gold" },
  NAS100: { proName: "PEPPERSTONE:NAS100", title: "NAS100" },
  US30: { proName: "PEPPERSTONE:US30", title: "US30" },
  "BTC/USD": { proName: "BITSTAMP:BTCUSD", title: "BTC/USD" },
};

export function TickerTape({ symbols }: { symbols: string[] }) {
  const container = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = container.current;
    if (!el) return;
    el.innerHTML = "";

    const list = symbols
      .map((s) => PRO_MAP[s])
      .filter(Boolean)
      .map((s) => ({ ...s, proName: s.proName }));

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: list,
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "en",
    });
    el.appendChild(script);

    return () => {
      el.innerHTML = "";
    };
  }, [symbols]);

  return (
    <div className="tradingview-widget-container w-full">
      <div ref={container} className="tradingview-widget-container__widget" />
    </div>
  );
}
