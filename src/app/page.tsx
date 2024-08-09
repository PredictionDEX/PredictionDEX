import MarketCard from "./components/card/market"
import StatsCard from "./components/card/stats"

export default function Home() {
  return (
    <div>
      <div className="flex gap-4 py-5 flex-wrap">
        <StatsCard title="Total Volume" value={10000} />
        <StatsCard title="Total Predictions" value={50} />
        <StatsCard title="Total Rewards" value={13049} />
        <StatsCard title="Total Users" value={1029} />
        <StatsCard title="Stats Markets" value={2039} />
      </div>
      <section>
        <h1 className="text-xl py-2 font-semibold">Live Markets</h1>
        <div className="flex flex-wrap">
          <MarketCard />
          <MarketCard />
          <MarketCard />
          <MarketCard />
          <MarketCard />
          <MarketCard />
          <MarketCard />
          <MarketCard />
          <MarketCard />
        </div>
      </section>
    </div>
  )
}
