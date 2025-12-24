'use client';

interface SimpleAreaChartProps {
  data: Array<{ date: string; value: number }>;
  title?: string;
  height?: number;
}

export function SimpleAreaChart({ data, title, height = 200 }: SimpleAreaChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#E1E1E1]">
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <div className="flex items-center justify-center h-[200px] text-gray-400">No data available</div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E1E1E1]">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div className="relative" style={{ height: `${height}px` }}>
        <svg width="100%" height={height} className="overflow-visible">
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EB5998" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#EB5998" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke="#EB5998"
            strokeWidth="2"
            points={data
              .map(
                (d, i) =>
                  `${(i / (data.length - 1)) * 100}%,${((1 - (d.value - minValue) / range) * height).toFixed(2)}`
              )
              .join(' ')}
          />
          <polygon
            fill="url(#areaGradient)"
            points={`0,${height} ${data
              .map(
                (d, i) =>
                  `${(i / (data.length - 1)) * 100}%,${((1 - (d.value - minValue) / range) * height).toFixed(2)}`
              )
              .join(' ')} ${(data.length - 1) / (data.length - 1) * 100}%,${height}`}
          />
        </svg>
      </div>
    </div>
  );
}

