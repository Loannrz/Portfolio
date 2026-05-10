import type { ShapeProps } from './types'

export default function LineShape({
  color = '#121212',
  size = 300,
  rotation = 0,
  className = '',
  opacity = 0.15,
  strokeWidth = 1,
}: ShapeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
    >
      {[0, 30, 60, 90, 120, 150].map((offset, i) => (
        <line
          key={i}
          x1="0"
          y1={offset}
          x2="300"
          y2={offset + 10}
          stroke={color}
          strokeWidth={strokeWidth}
          opacity={opacity - i * 0.02}
        />
      ))}
    </svg>
  )
}
