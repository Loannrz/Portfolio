import type { ShapeProps } from './types'

export default function GridShape({
  color = '#121212',
  size = 200,
  rotation = 0,
  className = '',
  opacity = 0.08,
  strokeWidth = 0.8,
}: ShapeProps) {
  const cols = 6
  const rows = 6
  const step = size / cols

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
    >
      {/* Vertical lines */}
      {Array.from({ length: cols + 1 }).map((_, i) => (
        <line
          key={`v${i}`}
          x1={i * step}
          y1={0}
          x2={i * step}
          y2={size}
          stroke={color}
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      ))}
      {/* Horizontal lines */}
      {Array.from({ length: rows + 1 }).map((_, i) => (
        <line
          key={`h${i}`}
          x1={0}
          y1={i * step}
          x2={size}
          y2={i * step}
          stroke={color}
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      ))}
      {/* Corner dots */}
      {[0, cols].map((ci) =>
        [0, rows].map((ri) => (
          <circle
            key={`d${ci}${ri}`}
            cx={ci * step}
            cy={ri * step}
            r={2}
            fill={color}
            opacity={opacity * 2}
          />
        ))
      )}
    </svg>
  )
}
