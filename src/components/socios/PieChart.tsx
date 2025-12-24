'use client';

interface PieChartData {
  key: string;
  value: number;
  percentage?: number;
  color?: string;
}

interface PieChartProps {
  data: PieChartData[];
  title?: string;
}

export function PieChart({ data, title }: PieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#E1E1E1]">
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <div className="flex items-center justify-center h-[200px] text-gray-400">No data available</div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = ['#EB5998', '#4ECDC4', '#45B7D1', '#FFA07A', '#DDA0DD', '#96CEB4', '#FFEAA7'];

  let currentAngle = -90;
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    return {
      ...item,
      percentage,
      startAngle,
      angle,
      color: item.color || colors[index % colors.length],
    };
  });

  const radius = 80;
  const centerX = 100;
  const centerY = 100;

  const createPath = (startAngle: number, endAngle: number) => {
    const start = (startAngle * Math.PI) / 180;
    const end = (endAngle * Math.PI) / 180;
    const x1 = centerX + radius * Math.cos(start);
    const y1 = centerY + radius * Math.sin(start);
    const x2 = centerX + radius * Math.cos(end);
    const y2 = centerY + radius * Math.sin(end);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E1E1E1]">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {segments.map((segment, index) => (
              <path
                key={index}
                d={createPath(segment.startAngle, segment.startAngle + segment.angle)}
                fill={segment.color}
                stroke="white"
                strokeWidth="2"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">{total.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </div>
        </div>
        <div className="ml-6 space-y-2">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-sm text-gray-700">{segment.key || `Item ${index + 1}`}</span>
              <span className="text-sm font-semibold text-gray-900">
                {segment.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

