import React from "react";

/**
 * A small, dependency-free SVG bar chart.
 *
 * Why hand-roll this instead of installing a charting library?
 * Two reasons: (1) zero extra dependencies for something this simple,
 * and (2) understanding how a bar chart actually maps numbers to pixel
 * positions is exactly the kind of thing worth being able to explain
 * in an interview, instead of "I imported a library and it did it."
 */
export default function BarChart({ data, labelKey, valueKey, formatValue }) {
  const width = 640;
  const height = 260;
  const padding = { top: 20, right: 20, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map((d) => d[valueKey]), 1);
  const barWidth = chartWidth / data.length - 10;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart">
      {/* Y-axis gridlines + labels */}
      {[0, 0.25, 0.5, 0.75, 1].map((f) => {
        const y = padding.top + chartHeight * (1 - f);
        const value = Math.round(maxValue * f);
        return (
          <g key={f}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} className="gridline" />
            <text x={padding.left - 8} y={y + 4} textAnchor="end" className="axis-label">
              {formatValue ? formatValue(value) : value}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const barHeight = (d[valueKey] / maxValue) * chartHeight;
        const x = padding.left + i * (barWidth + 10);
        const y = padding.top + chartHeight - barHeight;
        return (
          <g key={d[labelKey]}>
            <rect x={x} y={y} width={barWidth} height={barHeight} rx="3" className="bar" />
            <text
              x={x + barWidth / 2}
              y={height - padding.bottom + 16}
              textAnchor="end"
              transform={`rotate(-35 ${x + barWidth / 2} ${height - padding.bottom + 16})`}
              className="axis-label"
            >
              {d[labelKey]}
            </text>
            <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" className="bar-value">
              {formatValue ? formatValue(d[valueKey]) : d[valueKey]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
