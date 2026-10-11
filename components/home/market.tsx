import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { TickerTape } from "@/components/site/ticker-tape";
import { TradingViewWidget } from "@/components/site/tradingview";

export function MarketSection({
  eyebrow,
  title,
  subtitle,
  symbols,
}: {
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  symbols: string[];
}) {
  return (
    <section className="border-y border-border bg-surface/60 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />

        <Reveal className="mt-10">
          <TickerTape symbols={symbols} />
        </Reveal>

        <Reveal delay={100} className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <TradingViewWidget symbol="OANDA:XAUUSD" height={420} />
          <div className="grid gap-6">
            <TradingViewWidget symbol="FX:EURUSD" height={198} interval="60" />
            <TradingViewWidget symbol="PEPPERSTONE:NAS100" height={198} interval="60" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
