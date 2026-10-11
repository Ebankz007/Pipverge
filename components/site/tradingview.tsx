"use client";

import * as React from "react";

export function TradingViewWidget({
  symbol = "OANDA:XAUUSD",
  height = 420,
  interval = "60",
}: {
  symbol?: string;
  height?: number;
  interval?: string;
}) {
  const container = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = container.current;
    if (!el) return;
    el.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval,
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "rgba(17, 19, 24, 1)",
      gridColor: "rgba(255, 255, 255, 0.06)",
      hide_side_toolbar: true,
      allow_symbol_change: false,
      support_host: "https://www.tradingview.com",
    });
    el.appendChild(script);

    return () => {
      el.innerHTML = "";
    };
  }, [symbol, interval]);

  return (
    <div
      className="tradingview-widget-container overflow-hidden rounded-2xl border border-border"
      style={{ height }}
    >
      <div ref={container} className="h-full w-full" />
    </div>
  );
}
