import { useState } from "react";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { EdrixCard } from "@/components/edrix/EdrixCard";

const timeRanges = ["1H", "24H", "7D", "30D"] as const;

const requestData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  requests: Math.floor(Math.random() * 800 + 200),
}));

const errorData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  rate: parseFloat((Math.random() * 3).toFixed(2)),
}));

const latencyData = [
  { range: "0-50ms", count: 4521 },
  { range: "50-100ms", count: 3210 },
  { range: "100-200ms", count: 1892 },
  { range: "200-500ms", count: 834 },
  { range: "500ms-1s", count: 231 },
  { range: "1s+", count: 45 },
];

const geoData = [
  { country: "United States", requests: "5,241", pct: "35.3%" },
  { country: "Germany", requests: "2,134", pct: "14.4%" },
  { country: "Japan", requests: "1,892", pct: "12.8%" },
  { country: "United Kingdom", requests: "1,456", pct: "9.8%" },
  { country: "Brazil", requests: "1,123", pct: "7.6%" },
  { country: "India", requests: "987", pct: "6.7%" },
];

const tooltipStyle = {
  contentStyle: { backgroundColor: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '6px', fontFamily: 'DM Mono', fontSize: '11px' },
  labelStyle: { color: '#555' },
};

const AnalyticsPage = () => {
  const [range, setRange] = useState("24H");

  return (
    <div className="space-y-6 animate-fade-slide-up">
      <div className="flex items-center justify-between">
        <h1 className="font-syne font-bold text-3xl text-foreground">Analytics</h1>
        <div className="flex gap-1 bg-secondary rounded-md p-0.5">
          {timeRanges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                range === r ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Request Volume */}
      <EdrixCard>
        <h3 className="font-syne font-bold text-foreground mb-4">Request Volume</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={requestData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
            <XAxis dataKey="hour" tick={{ fill: '#555', fontSize: 10, fontFamily: 'DM Mono' }} axisLine={{ stroke: '#1a1a1a' }} />
            <YAxis tick={{ fill: '#555', fontSize: 10, fontFamily: 'DM Mono' }} axisLine={{ stroke: '#1a1a1a' }} />
            <Tooltip {...tooltipStyle} />
            <Area type="monotone" dataKey="requests" stroke="#00f5ff" fill="#00f5ff" fillOpacity={0.1} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </EdrixCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Error Rate */}
        <EdrixCard>
          <h3 className="font-syne font-bold text-foreground mb-4">Error Rate (%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={errorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="hour" tick={{ fill: '#555', fontSize: 10, fontFamily: 'DM Mono' }} axisLine={{ stroke: '#1a1a1a' }} />
              <YAxis tick={{ fill: '#555', fontSize: 10, fontFamily: 'DM Mono' }} axisLine={{ stroke: '#1a1a1a' }} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="rate" stroke="#ff4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </EdrixCard>

        {/* Latency Distribution */}
        <EdrixCard>
          <h3 className="font-syne font-bold text-foreground mb-4">Latency Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="range" tick={{ fill: '#555', fontSize: 9, fontFamily: 'DM Mono' }} axisLine={{ stroke: '#1a1a1a' }} />
              <YAxis tick={{ fill: '#555', fontSize: 10, fontFamily: 'DM Mono' }} axisLine={{ stroke: '#1a1a1a' }} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="count" fill="#00f5ff" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </EdrixCard>
      </div>

      {/* Geo breakdown */}
      <EdrixCard>
        <h3 className="font-syne font-bold text-foreground mb-4">Geographic Breakdown</h3>
        <table className="w-full text-xs font-mono">
          <thead><tr className="border-b border-border text-muted-foreground"><th className="text-left py-2">COUNTRY</th><th className="text-right py-2">REQUESTS</th><th className="text-right py-2">% TOTAL</th></tr></thead>
          <tbody>
            {geoData.map((g) => (
              <tr key={g.country} className="border-b border-border/30">
                <td className="py-2 text-foreground">{g.country}</td>
                <td className="py-2 text-right text-muted-foreground">{g.requests}</td>
                <td className="py-2 text-right text-primary">{g.pct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </EdrixCard>
    </div>
  );
};

export default AnalyticsPage;
