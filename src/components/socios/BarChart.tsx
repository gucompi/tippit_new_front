'use client';

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  title?: string;
  height?: number;
}

export function BarChart({ data, title, height = 200 }: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#E1E1E1]">
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <div className="flex items-center justify-center h-[200px] text-gray-400">No data available</div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));
  const colors = ['#EB5998', '#4ECDC4', '#45B7D1', '#FFA07A', '#DDA0DD'];

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E1E1E1]">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div className="space-y-3" style={{ height: `${height}px` }}>
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          return (
            <div key={index} className="flex items-center gap-3">
              <div className="w-24 text-sm text-gray-700 truncate">{item.label}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color || colors[index % colors.length],
                  }}
                />
              </div>
              <div className="w-20 text-sm font-semibold text-gray-800 text-right">
                {item.value.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

